var html = require('choo/html')
var asElement = require('prismic-element')
var { Predicates } = require('prismic-javascript')
var view = require('../components/view')
var {
  img,
  asText,
  loader,
  resolve,
  truncate,
  HTTPError
} = require('../components/base')

module.exports = view(start, meta)

function start (state, emit) {
  return state.prismic.getSingle('start', function (err, doc) {
    if (err) throw HTTPError(404, err)

    var threads = state.prismic.get(
      Predicates.at('document.type', 'thread'),
      { pageSize: 100 },
      function (err, res) {
        if (err || !res) return []
        return res.results
      }
    )

    if (!doc) {
      return html`
        <main class="View-main">
          <div class="Text">
            <h1>${state.partial ? asText(state.partial.data.title) : loader(16)}</h1>
            ${state.partial ? asElement(state.partial.data.description, resolve) : html`<p>${loader(48)}</p>`}
          </div>
        </main>
      `
    }

    return html`
      <main class="View-main">
        <div class="Text">
          <h1>${asText(doc.data.title)}</h1>
          ${asElement(doc.data.description, resolve)}
          <ul>
            ${threads.map((thread) => html`
              <li>
                <a href="${resolve(thread)}">
                  ${img(doc.data.image, { sizes: '35rem' }, {
                    sizes: [400, 800, [1200, 'q_50']]
                  })}
                  ${asText(thread.data.title)} • ${thread.data.age}
                  <p>${truncate(asText(thread.data.description), 180)}</p>
                  <em>Mål: ${thread.data.goal.data.number}</em>
                </a>
              </li>
            `)}
          </ul>
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
