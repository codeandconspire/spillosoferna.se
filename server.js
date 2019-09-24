if (!process.env.NOW) require('dotenv/config')

var { get, post } = require('koa-route')
var compose = require('koa-compose')
var session = require('koa-session')
var body = require('koa-body')
var jalla = require('jalla')
var Prismic = require('prismic-javascript')
var api = require('./lib/prismic-api')

var REPOSITORY = 'https://spillosoferna.cdn.prismic.io/api/v2'

var app = jalla('index.js', {
  sw: 'sw.js'
})

app.keys = [process.env.SESSION_SECRET]

app.use(session({
  key: 'spillo:user',
  maxAge: 604800,
  renew: true
}, app))

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
