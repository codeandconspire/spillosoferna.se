var html = require('choo/html')
var asElement = require('prismic-element')
var { Predicates } = require('prismic-javascript')
var view = require('../components/view')
var {
  img,
  text,
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
          <div class="u-container">
            <div class="Text">
              <h1>${state.partial ? asText(state.partial.data.title) : loader(16)}</h1>
            </div>
          </div>
        </main>
      `
    }

    var featured = doc.data.featured_thread.id ? threads.find((thread) => thread.id === doc.data.featured_thread.id) : null

    return html`
      <main class="View-main">
        <div class="u-container">
          <div class="Text">
            <h1>${asText(doc.data.title)}</h1>

            ${featured ? html`
              <section>
                ${img(doc.data.image, { sizes: '35rem' }, {
                  sizes: [400, 800, [1200, 'q_50']]
                })}
                <h2>${featured.data.title ? asText(featured.data.title) : text`Namnlös utmaning`}</h2>
                <p>${truncate(asText(featured.data.description), 180)}</p>
                <em>Mål: ${featured.data.goal.data.number}</em>
                ${featured.data.age}
                <a href="${resolve(featured)}">${text`Se utmaning`}</a>
              </section>
            ` : null}

            <h1>${text`Utmaningar`}</h1>
            
            <ul>
              ${threads.map(function (thread) {
                return thread.data.include !== 'Nej' ? html`
                  <li>
                    ${img(doc.data.image, { sizes: '35rem' }, {
                      sizes: [400, 800, [1200, 'q_50']]
                    })}
                    <h2>${thread.data.title ? asText(thread.data.title) : text`Namnlös utmaning`}</h2>
                    <p>${truncate(asText(thread.data.description), 180)}</p>
                    <em>Mål: ${thread.data.goal.data.number}</em>
                    ${thread.data.age}
                    <a href="${resolve(thread)}">${text`Se utmaning`}</a>
                  </li>
                ` : null
              })}
            </ul>
          </div>
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
