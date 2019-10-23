var html = require('choo/html')
var asElement = require('prismic-element')
var { Predicates } = require('prismic-javascript')
var view = require('../components/view')
var accordion = require('../components/accordion')
var gallery = require('../components/gallery')
var callout = require('../components/callout')
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
              <h2>${state.partial ? asText(state.partial.data.title) : loader(16)}</h2>
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
            <h2>${asText(doc.data.title)}</h2>

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

            <h2>${text`Utmaningar`}</h2>
            
            <ul>
              ${threads.map(function (thread) {
                return thread.data.include !== 'Nej' ? html`
                  <li>
                    ${img(doc.data.image, { sizes: '35rem' }, {
                      sizes: [400, 800, [1200, 'q_50']]
                    })}
                    <h3>${thread.data.title ? asText(thread.data.title) : text`Namnlös utmaning`}</h3>
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

        <div class="u-light">
          <div class="u-container u-nbfc"> 
            ${gallery({ title: text`Inspiration`, items: doc.data.inspo })}

            ${accordion({
              title: text`Vanliga frågor`,
              items: doc.data.faq.map(function (item) {
                return {
                  title: asText(item.faq_title),
                  body: asElement(item.faq_body)
                }
              })
            })}
          </div>
        </div>

        ${callout({
          title: asText(doc.data.outro_heading),
          body: asElement(doc.data.outro_body),
          link: resolve(doc.data.outro_link),
          linkText: doc.data.outro_link_text
        })}
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
