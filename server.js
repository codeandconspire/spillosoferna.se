if (!process.env.NOW) require('dotenv/config')

var { get, post } = require('koa-route')
var compose = require('koa-compose')
var session = require('koa-session')
var body = require('koa-body')
var jalla = require('jalla')
var Prismic = require('prismic-javascript')
var api = require('./lib/prismic-api')
var imageproxy = require('./lib/cloudinary-proxy')

var REPOSITORY = 'https://spillosoferna.cdn.prismic.io/api/v2'

var app = jalla('index.js', {
  sw: 'sw.js'
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
 * on our edge servers (Cloudinary) saving on costs. Seeing as Cloudflare has
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

app.use(get('/api/prismic-proxy', async function (ctx) {
  var { predicates, ...opts } = ctx.query
  ctx.body = await api(predicates, { ...opts, req: ctx.req })
}))

app.use(post('/', compose([body({ multipart: true }), async function (ctx, next) {
  var body = ctx.request.body.fields || ctx.request.body
  try {
    const query = Prismic.Predicates.at('my.user.uid', body.code)
    const { results: [user] } = await api(query, { req: ctx.req })
    ctx.assert(user, 401, 'user not found')
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

app.use(get('/start/:thread?', async function (ctx, next) {
  try {
    ctx.assert(ctx.session.user, 401, 'user not found')
    const query = Prismic.Predicates.at('my.user.uid', ctx.session.user)
    const { results: [user] } = await api(query, { req: ctx.req })
    if (!user) ctx.throw(401, 'user not found')
  } catch (err) {
    if (ctx.accepts('html')) ctx.redirect('/')
    else ctx.throw(err.status || 400, err.message)
  }
}))

app.listen(process.env.PORT || 8080)
