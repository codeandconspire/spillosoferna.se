var html = require('choo/html')
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
  HTTPError,
  asElement
} = require('../components/base')

module.exports = view(thread, meta, { back: true, green: true })

function thread (state, emit) {
  if (!state.user) throw HTTPError(401, 'Not authorized')

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

    var special = doc.data.intro === 'Ja'

    return html`
      <main class="View-main">
        ${hero({
          image: {
            alt: doc.data.image.alt || '',
            sizes: '100vw',
            src: src(doc.data.image.url, 900),
            srcset: srcset(doc.data.image.url, [400, 600, 900, 1200, 1800, [2600, 'q_50']])
          },
          label: doc.data.age && !special ? {
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
          text: special ? text`Moment` : text`Arbetspass`
        } : null, doc.data.rules_1 && doc.data.rules_1.length ? {
          id: 'rules',
          text: text`Läroplan`
        } : null, doc.data.inspo.length ? {
          id: 'gallery',
          text: text`Inspiration`
        } : null, doc.data.faq.length ? {
          id: 'faq',
          text: text`Vanliga frågor`
        } : null, {
          id: 'feedback',
          text: text`Feedback`
        }].filter(Boolean))}
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
              subtitle: text`Inför arbetspassen`,
              main: asElement(doc.data.facts, resolve, serialize)
            })}
          </div>
        ` : null}

        ${doc.data.lessons.length ? html`
          <div class="u-container View-panel" id="lessons">
            <div class="Text">
              <h2>${special ? text`Moment` : text`Arbetspass`}</h2>
            </div>

            ${doc.data.lessons.map(function (slice) {
              if (slice.slice_type !== 'lesson') return null
              return lesson({
                title: asText(slice.primary.name) || (special ? text`Moment` : text`Arbetspass`),
                extra: slice.primary.extra,
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
              })
            }).filter(Boolean)}
          </div>
        ` : null}

        ${doc.data.rules_1 && doc.data.rules_1.length ? html`
          <div class="View-panel View-panel--white" id="rules">
            <div class="u-container u-nbfc">
              <div class="Text Text--small Text--wide">
                <h2>${text`Koppling till läroplanen`}</h2>
                <div class="Text-columns">
                  ${doc.data.rules_1 && doc.data.rules_1.length ? html`
                    <div class="Text-column">
                      ${asElement(doc.data.rules_1, resolve, serialize)}
                    </div>
                  ` : null}
                  ${doc.data.rules_2 && doc.data.rules_2.length ? html`
                    <div class="Text-column">
                      ${asElement(doc.data.rules_2, resolve, serialize)}
                    </div>
                  ` : null}
                </div>
              </div>
            </div>
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

        ${state.prismic.getSingle('website', function (err, website) {
          if (err) throw HTTPError(404, err)
          if (!website) return null

          return html`
            <div id="feedback">
              ${callout({
                title: asText(website.data.outro_heading),
                body: asElement(website.data.outro_body, resolve, serialize),
                link: '/start/om',
                linkText: website.data.outro_link_text
              })}
            </div>
          `
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
