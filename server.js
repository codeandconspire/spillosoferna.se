if (!process.env.HEROKU) require('dotenv/config')

var Prismic = require('prismic-javascript')
var { get, post } = require('koa-route')
var compose = require('koa-compose')
var session = require('koa-session')
var body = require('koa-body')
var jalla = require('jalla')
var purge = require('./lib/purge.js')
var api = require('./lib/prismic-api')
var imageproxy = require('./lib/cloudinary-proxy')

var app = jalla('index.js', {
  serve: +process.env.HEROKU
})

app.keys = [process.env.SESSION_SECRET]

app.use(session({
  key: 'spillo:user',
  maxAge: 2592000000, // one month
  renew: true
}, app))

/**
 * Proxy image transform requests to Cloudinary
 * By running all transforms through our own server we can cache the response
 * on our edge servers (Cloudflare) saving on costs. Seeing as Cloudflare has
 * free unlimited cache and Cloudinary does not, we will only be charged for
 * the actual image transforms, of which the first 25 000 are free
 */
app.use(get('/media/:type/:transform/:uri(.+)', async function (ctx, type, transform, uri) {
  if (ctx.querystring) uri += `?${ctx.querystring}`
  var stream = await imageproxy(type, transform, uri)
  var headers = ['etag', 'last-modified', 'content-length', 'content-type']
  headers.forEach((header) => ctx.set(header, stream.headers[header]))
  ctx.set('Cache-Control', `public, max-age=${60 * 60 * 24 * 365}`)
  ctx.body = stream
}))

/**
 * Purge Cloudflare cache whenever content is published to Prismic
 */
app.use(post('/api/prismic-hook', compose([body(), function (ctx) {
  var secret = ctx.request.body && ctx.request.body.secret
  ctx.assert(secret === process.env.PRISMIC_SECRET, 403, 'Secret mismatch')
  return new Promise(function (resolve, reject) {
    purge(app.entry, function (err, response) {
      if (err) return reject(err)
      ctx.type = 'application/json'
      ctx.body = {}
      resolve()
    })
  })
}])))

/**
 * Proxy requests to Prismic
 */
app.use(get('/api/prismic-proxy', async function (ctx) {
  var { predicates, ...opts } = ctx.query
  ctx.body = await api(predicates, { ...opts, req: ctx.req })
}))

/**
 * Read choice to skipping user intro
 */
app.use(function (ctx, next) {
  try {
    ctx.state.skipintro = JSON.parse(ctx.cookies.get('spillo:skipintro'))
  } catch (e) {
    ctx.state.skipintro = false
  }
  return next()
})

/**
 * Read choice of selected age
 */
app.use(function (ctx, next) {
  try {
    ctx.state.age = JSON.parse(ctx.cookies.get('spillo:age'))
  } catch (e) {
    ctx.state.age = false
  }
  return next()
})

/**
 * Persist choice to skipping user intro
 */
app.use(post('/start', compose([body(), function (ctx, next) {
  if (ctx.body) {
    if ('skipintro' in ctx.body) {
      ctx.cookies.set('spillo:skipintro', true, {
        maxAge: 1000 * 60 * 60 * 24 * 365
      })
      ctx.state.skipintro = true
    }
    if ('age' in ctx.body) {
      ctx.cookies.set('spillo:age', ctx.body.age, {
        maxAge: 1000 * 60 * 60 * 24 * 365
      })
      ctx.state.age = ctx.body.age
    }
  }
  ctx.redirect('/')
}])))

/**
 * Forward logged in user to start
 */
app.use(get('/', function (ctx, next) {
  if (ctx.session.user) ctx.redirect('/start')
  else return next()
}))

/**
 * Get currently logged in user
 */
app.use(get('/konto', async function (ctx, next) {
  ctx.assert(ctx.session.user, 401, 'Not authorized')
  if (ctx.accepts('html', 'json') === 'json') {
    try {
      const query = Prismic.Predicates.at('my.user.uid', ctx.session.user)
      const { results: [user] } = await api(query, { req: ctx.req })
      ctx.assert(user, 401, 'User not found')
      ctx.body = {
        uid: user.uid,
        username: user.data.username
      }
    } catch (err) {
      delete ctx.session.user
      ctx.throw(401, 'Not authorized')
    }
  }
}))

/**
 * Signin user
 */
app.use(post('/', compose([body(), async function (ctx, next) {
  var body = ctx.request.body
  try {
    const query = Prismic.Predicates.at('my.user.uid', body.code)
    const { results: [user] } = await api(query, { req: ctx.req })
    ctx.assert(user, 401, 'User not found')
    ctx.session.user = user.uid
    ctx.redirect('/start')
  } catch (err) {
    if (ctx.accepts('html')) {
      ctx.status = err.status || 400
      ctx.state.error = err.message
      return next()
    } else {
      ctx.throw(err.status || 400, err.message)
    }
  }
}])))

/**
 * Signout user
 */
app.use(get('/logga-ut', signout))
app.use(post('/logga-ut', signout))
function signout (ctx, next) {
  delete ctx.session.user
  if (ctx.accepts('html')) {
    ctx.redirect('/')
  } else {
    ctx.body = {}
  }
}

/**
 * Populate user field
 */
app.use(async function (ctx, next) {
  if (!ctx.accepts('html') || !ctx.session.user) return next()
  try {
    const query = Prismic.Predicates.at('my.user.uid', ctx.session.user)
    const { results: [user] } = await api(query, { req: ctx.req })
    ctx.assert(user, 401, 'User not found')
    ctx.state.user = {
      uid: user.uid,
      username: user.data.username
    }
  } catch (err) {
    delete ctx.session.user
  }
  return next()
})

/**
 * Assert user is signed in to access private content
 */
app.use(get('/start/:thread?', async function (ctx, thread, next) {
  if (ctx.session.user) return next()
  try {
    if (!thread) ctx.throw(401, 'Not authorized')
    const query = Prismic.Predicates.at('my.thread.uid', thread)
    const { results: [doc] } = await api(query, { req: ctx.req })
    ctx.assert(doc.data.public, 401, 'Not authorized')
    return next()
  } catch (err) {
    if (ctx.accepts('html')) ctx.redirect('/')
    else ctx.throw(err.status || 500)
  }
}))

/**
 * Set cache headers for HTML pages
 * By caching HTML on our edge servers (Cloudflare) we keep response times and
 * hosting costs down. The `s-maxage` property tells Cloudflare to cache the
 * response for a month whereas we set the `max-age` to cero to prevent clients
 * from caching the response
 */
app.use(function (ctx, next) {
  if (!ctx.accepts('html')) return next()
  var previewCookie = ctx.cookies.get(Prismic.previewCookie)
  if (previewCookie || ctx.session.user) {
    ctx.set('Cache-Control', 'no-cache, private, max-age=0, must-revalidate')
  } else if (!ctx.response.get('Cache-Control') && app.env !== 'development') {
    ctx.set('Cache-Control', `s-maxage=${60 * 60 * 24 * 7}, max-age=0`)
  }

  return next()
})

/**
 * Purge Cloudflare cache when starting production server
 */
if (+process.env.HEROKU && app.env === 'production') {
  purge(app.entry, function (err) {
    //if (err) app.emit('error', err)
    if (err) console.log(err)
    else app.listen(process.env.PORT || 8080)
  })
} else {
  app.listen(process.env.PORT || 8080)
}
