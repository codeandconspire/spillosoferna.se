var cccpurge = require('cccpurge')
var Prismic = require('prismic-javascript')
var { resolve } = require('../components/base')

var REPOSITORY = 'https://spillosoferna.cdn.prismic.io/api/v2'

module.exports = purge

function purge (entry, urls, callback = Function.prototype) {
  if (typeof urls === 'function') {
    callback = urls
    urls = []
  }

  cccpurge(require(entry), {
    urls: urls,
    resolve: resolveRoute,
    root: `https://${process.env.HOST}`,
    zone: process.env.CLOUDFLARE_ZONE,
    email: process.env.CLOUDFLARE_EMAIL,
    key: process.env.CLOUDFLARE_KEY
  }, callback)
}

async function resolveRoute (route, done) {
  switch (route) {
    case '/start/:uid': {
      query(Prismic.Predicates.at('document.type', 'thread')).then(
        urls => done(null, urls),
        err => done(err)
      )
      break
    }
    case '/malen/:uid': {
      query(Prismic.Predicates.at('document.type', 'goal')).then(
        urls => done(null, urls),
        err => done(err)
      )
      break
    }
    default: done(null)
  }
}

async function query (predicates) {
  var api = await Prismic.getApi(REPOSITORY)
  var opts = { pageSize: 100 }
  var urls = []

  await api.query(predicates, opts).then(function (response) {
    response.results.forEach((doc) => urls.push(resolve(doc)))
    if (response.total_pages > 1) {
      const pages = []
      for (let i = 2; i <= response.total_pages; i++) {
        const page = Object.assign({}, opts, { page: i })
        pages.push(api.query(predicates, page).then(function (response) {
          response.results.forEach((doc) => urls.push(resolve(doc)))
        }))
      }
      return Promise.all(pages)
    }
  })
  return urls
}
