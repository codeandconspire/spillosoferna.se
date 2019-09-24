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
    const api = await Prismic.getApi(REPOSITORY, {
      req: ctx.req,
      accessToken: process.env.PRISMIC_TOKEN
    })
    const user = await api.getByUID('user', body.code)
    if (!user) ctx.throw(401, 'user not found')
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

app.use(get('/start/(.*)', async function (ctx, next) {
  try {
    if (!ctx.session.user) throw new Error('user not found')
    const api = await Prismic.getApi(REPOSITORY, {
      req: ctx.req,
      accessToken: process.env.PRISMIC_TOKEN
    })
    const user = await api.getByUID('user', ctx.session.user)
    if (!user) ctx.throw(401, 'user not found')
  } catch (err) {
    if (ctx.accepts('html')) ctx.redirect('/')
    else ctx.throw(err.status || 400, err.message)
  }
}))

app.listen(process.env.PORT || 8080)
