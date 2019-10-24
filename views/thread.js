var html = require('choo/html')
var asElement = require('prismic-element')
var accordion = require('../components/accordion')
var callout = require('../components/callout')
var view = require('../components/view')
var goal = require('../components/goal')
var more = require('../components/more')
var grid = require('../components/grid')
var card = require('../components/card')
var lesson = require('../components/lesson')
var hero = require('../components/hero')
var gallery = require('../components/gallery')
var symbols = require('../components/symbols')
var Tabs = require('../components/header/tabs')
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
        ${state.cache(Tabs, `tabs-${doc.id}`).render([{
          id: 'introduction',
          text: text`Inledning`
        }, doc.data.facts.length ? {
          id: 'facts',
          text: text`Faktan`
        } : null, doc.data.lessons.length ? {
          id: 'lessons',
          text: text`Lektioner`
        } : null, doc.data.inspo.length ? {
          id: 'gallery',
          text: text`Inspiration`
        } : null, doc.data.faq.length ? {
          id: 'faq',
          text: text`Vanliga frågor`
        } : null, doc.data.outro_heading.length ? {
          id: 'outro',
          text: text`Feedback`
        } : null].filter(Boolean))}
        <div class="View-panel View-panel--white" id="introduction">
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

        ${doc.data.facts.length ? html`
          <div class="u-container View-panel" id="facts">
            <div class="Text" >
              <h2>${text`Faktan`}</h2>
            </div>
            ${lesson({
              title: asText(doc.data.facts_title) || text`Faktan`,
              subtitle: text`Inför lektionerna`,
              main: asElement(doc.data.facts, resolve, serialize)
            })}
          </div>
        ` : null}
      
        ${doc.data.lessons.length ? html`
          <div class="u-container View-panel" id="lessons">
            <div class="Text">
              <h2>${text`Lektioner`}</h2>
            </div>

            ${doc.data.lessons.map(function (slice) {
              if (slice.slice_type !== 'lesson') return null
              return html`
                ${lesson({
                  title: asText(slice.primary.name) || text`Lektionen`,
                  subtitle: slice.primary.label,
                  time: slice.primary.duration,
                  main: asElement(slice.primary.description, resolve, serialize),
                  preparation: asElement(slice.primary.preparation, resolve, serialize),
                  steps: slice.items.map(function (step) {
                    return {
                      body: asElement(step.text, resolve, serialize),
                      note: asText(step.note) ? asElement(step.note, resolve, serialize) : null
                    }
                  })
                })}
              `
            }).filter(Boolean)}
          </div>
        ` : null}

        ${doc.data.inspo.length ? html`
          <div class="View-panel View-panel--white" id="gallery">
            <div class="u-container u-nbfc">
              ${gallery({ title: text`Inspiration`, items: doc.data.inspo })}
            </div>
          </div>
        ` : null}
        ${doc.data.faq.length ? html`
          <div class="View-panel View-panel--white" id="faq">
            <div class="u-container u-nbfc">
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
        ` : null}
        ${doc.data.outro_heading.length ? html`
          <div id="outro">
            ${callout({
              title: asText(doc.data.outro_heading),
              body: asElement(doc.data.outro_body, resolve, serialize),
              link: resolve(doc.data.outro_link),
              linkText: doc.data.outro_link_text
            })}
          </div>
        ` : null}
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
