var Prismic = require('prismic-javascript')

var REPOSITORY = 'https://spillosoferna.cdn.prismic.io/api/v2'

module.exports = api

function api (predicates, opts) {
  var { req, ...options } = opts
  return Prismic.getApi(REPOSITORY, {
    req: req,
    accessToken: process.env.PRISMIC_TOKEN
  }).then(function (api) {
    return api.query(predicates, options)
  })
}
