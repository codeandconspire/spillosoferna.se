var html = require('choo/html')
var { Predicates } = require('prismic-javascript')
var view = require('../components/view')
var accordion = require('../components/accordion')
var gallery = require('../components/gallery')
var card = require('../components/card')
var callout = require('../components/callout')
var serialize = require('../components/text/serialize')
var {
  img,
  text,
  asText,
  loader,
  resolve,
  truncate,
  HTTPError,
  asElement
} = require('../components/base')

module.exports = view(start, meta)

function start (state, emit) {
  return state.prismic.getSingle('start', function (err, doc) {
    if (err) throw HTTPError(404, err)

    if (!doc) {
      return html`
        <main class="View-main">
          <div class="u-container">
            <div class="Text u-spaceSmall">
              <h2>${state.partial ? asText(state.partial.data.title) : loader(16)}</h2>
            </div>
          </div>
        </main>
      `
    }

    return html`
      <main class="View-main">
        <div class="u-container">
        </div>
      </main>
    `
  })
}

function meta (state) {
  return state.prismic.getSingle('start', function (err, doc) {
    if (err) throw HTTPError(404, err)
    if (!doc) return null
    var props = {
      title: asText(doc.data.title),
      description: asText(doc.data.description)
    }

    return props
  })
}
