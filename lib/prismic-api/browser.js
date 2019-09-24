module.exports = api

function api (predicates, opts) {
  var query = `predicates=${encodeURIComponent(predicates)}`
  for (const [key, value] of Object.entries(opts)) {
    query += `&${key}=${value}`
  }
  return window.fetch(`/api/prismic-proxy?${query}`, {
    headers: {
      Accept: 'application/json'
    }
  }).then(function (res) {
    if (!res.ok) throw new Error(res.statusMessage)
    return res.json()
  })
}
