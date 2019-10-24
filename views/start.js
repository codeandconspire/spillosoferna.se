var html = require('choo/html')
var asElement = require('prismic-element')
var { Predicates } = require('prismic-javascript')
var view = require('../components/view')
var accordion = require('../components/accordion')
var gallery = require('../components/gallery')
var callout = require('../components/callout')
var serialize = require('../components/text/serialize')
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
            <div class="Text u-spaceSmall">
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
          <div class="View-intro u-spaceSmall">
            <div class="Text">
              <h2>${asText(doc.data.title)}</h2>
            </div>
            ${featured ? html`
              <a class="View-button" href="${resolve(featured)}">
                <svg width="15" height="10" role="presentation">
                  <g stroke="#000" stroke-width="2" fill="none" fill-rule="evenodd" stroke-linecap="round"><path d="M9.257 8.536L12.793 5 9.257 1.464M12.793 5H1.056"/></g>
                </svg>
                ${text`Visa introduktion`}
              </a>
            ` : null}
            
          </div>

          <hr>

          <div class="Text">
            <h2>${text`Utmaningar`}</h2>
          </div>
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

        <div class="u-light">
          <div class="u-container u-nbfc"> 
            ${gallery({ title: text`Inspiration`, items: doc.data.inspo })}

            ${accordion({
              title: text`Vanliga frågor`,
              items: doc.data.faq.map(function (item) {
                return {
                  title: asText(item.faq_title),
                  body: asElement(item.faq_body, resolve, serialize)
                }
              })
            })}
          </div>
        </div>

        ${callout({
          title: asText(doc.data.outro_heading),
          body: asElement(doc.data.outro_body, resolve, serialize),
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
