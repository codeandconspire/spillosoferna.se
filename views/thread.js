var html = require('choo/html')
var asElement = require('prismic-element')
var accordion = require('../components/accordion')
var callout = require('../components/callout')
var view = require('../components/view')
var goal = require('../components/goal')
var more = require('../components/more')
var grid = require('../components/grid')
var card = require('../components/card')
var hero = require('../components/hero')
var gallery = require('../components/gallery')
var symbols = require('../components/symbols')
var serialize = require('../components/text/serialize')
var {
  src,
  text,
  asText,
  srcset,
  loader,
  resolve,
  HTTPError
} = require('../components/base')

module.exports = view(thread, meta)

function thread (state, emit) {
  return state.prismic.getByUID('thread', state.params.uid, function (err, doc) {
    if (err) throw HTTPError(404, err)
    if (!doc) {
      return html`
        <main class="View-main">
          ${state.partial ? hero({
            image: {
              alt: state.partial.data.image.alt || '',
              sizes: '100vw',
              src: src(state.partial.data.image.url, 900),
              srcset: srcset(state.partial.data.image.url, [400, 600, 900, 1200, 1800, [2600, 'q_50']])
            },
            label: loader(6),
            title: asText(state.partial.data.title),
            body: asText(state.partial.data.description)
          }) : hero.loading()}
        </main>
      `
    }

    return html`
      <main class="View-main">
        ${hero({
          image: {
            alt: doc.data.image.alt || '',
            sizes: '100vw',
            src: src(doc.data.image.url, 900),
            srcset: srcset(doc.data.image.url, [400, 600, 900, 1200, 1800, [2600, 'q_50']])
          },
          label: doc.data.age ? {
            symbol: symbols.people(),
            text: text`Årskurs ${doc.data.age}`
          } : null,
          title: asText(doc.data.title),
          body: asText(doc.data.description)
        })}
        <div class="View-panel">
          <div class="u-container">
            ${grid([
              grid.cell({ size: { lg: '2of3' } }, html`
                <div class="Text">
                  <h2>${text`Inledning`}</h2>
                  ${asElement(doc.data.body, resolve, serialize)}
                </div>
              `),
              grid.cell({ size: { lg: '1of3' } }, html`
                <div>
                  ${doc.data.goal.id && !doc.data.goal.isBroken ? card({
                    panel: goal.heading({
                      title: asText(doc.data.goal.data.title),
                      number: doc.data.goal.data.number
                    }),
                    title: text`${asText(doc.data.title)} och mål ${doc.data.goal.data.number}`,
                    body: more(html`
                      <div class="Text Text--static">
                        ${asElement(doc.data.goal_text.slice(0, 1), resolve, serialize)}
                      </div>
                    `, html`
                      <div class="Text Text--static">
                        ${asElement(doc.data.goal_text, resolve, serialize)}
                      </div>
                    `)
                  }) : null}
                </div>
              `)
            ])}
          </div>
        </div>
        <div class="Text">
          <h2>${text`Lektioner`}</h2>
        </div>
        ${doc.data.lessons.map(function (slice) {
          if (slice.slice_type !== 'lesson') return null
          return html`
            <details>
              <summary class="Text">
                ${slice.primary.label} • ${slice.primary.duration}
                <h2>${asText(slice.primary.name)}</h2>
              </summary>
              <div class="Text">
                ${asElement(slice.primary.description, resolve, serialize)}
                ${slice.primary.preparation.length ? html`
                  <h3>${text`Ha tillgängligt`}</h3>
                  ${asElement(slice.primary.preparation)}
                ` : null}
                ${slice.primary.resource.url ? html`
                  <h3>${text`Material`}</h3>
                  <a href="${slice.primary.resource.url}">${slice.primary.resource.name}</a>
                ` : null}
                <h3>${text`Gör så här`}</h3>
                <ol>
                ${slice.items.map((item, index) => html`
                  <li>
                    ${asElement(item.text, resolve, serialize)}
                    ${item.note.length ? html`
                      <h4>${text`Till dig som pedagog`}</h4>
                      ${asElement(item.note, resolve)}
                    ` : null}
                  </li>
                `)}
                </ol>
              </div>
            </details>
          `
        }).filter(Boolean)}

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
  return state.prismic.getByUID('thread', state.params.uid, function (err, doc) {
    if (err) throw HTTPError(404, err)
    if (!doc) return null
    var props = {
      title: asText(doc.data.title),
      description: asText(doc.data.description)
    }

    return props
  })
}
