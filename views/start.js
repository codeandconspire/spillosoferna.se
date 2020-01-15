var html = require('choo/html')
var asElement = require('prismic-element')
var { Predicates } = require('prismic-javascript')
var view = require('../components/view')
var card = require('../components/card')
var pills = require('../components/pills')
var gallery = require('../components/gallery')
var callout = require('../components/callout')
var Dropdown = require('../components/dropdown')
var Featured = require('../components/featured')
var accordion = require('../components/accordion')
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

var AGES = ['F-6', 'F-3', '2-3', '4-6']

module.exports = view(start, meta)

function start (state, emit) {
  if (!state.user) throw HTTPError(401, 'Not authorized')

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

    var featured = doc.data.featured_thread.id
      ? threads.find((thread) => thread.id === doc.data.featured_thread.id)
      : null

    return html`
      <main class="View-main">
        <div class="u-container">
          <section class="View-intro">
            <header class="View-header">
              <div class="View-heading">
                <div class="Text">
                  <h2>${asText(doc.data.title)}</h2>
                </div>
              </div>
              <span class="Text-small">
                Inloggad som ${state.cache(Dropdown, 'user-dropdown').render(state.user.username, html`
                  <div class="Text">
                    <form action="/logga-ut" method="POST">
                      <button type="submit">${text`Sign out`}</a>
                    </form>
                  </div>
                `)}
              </span>
            </header>
            ${featured ? state.cache(Featured, 'start-featured').render({
              href: resolve(featured),
              image: featured.data.image,
              title: asText(featured.data.title),
              body: asText(featured.data.description),
              duration: featured.data.duration
            }) : null}
          </section>
        </div>

        <div class="u-container">
          <hr>
        </div>

        <section class="View-panel View-panel--divided">
          <div class="u-container">
            <header class="View-header">
              <div class="View-heading">
                <div class="Text">
                  <h2>${text`Utmaningar`}</h2>
                </div>
              </div>
              ${pills(AGES.map(function (age) {
                var predicates = [
                  Predicates.at('my.thread.age', age),
                  Predicates.at('my.thread.include', 'Ja')
                ]
                return state.prismic.get(predicates, { pageSize: 1 }, function (err, res) {
                  if (err || !res || !res.results_size) return null
                  var selected = age === state.query.age
                  return {
                    href: selected
                      ? state.href
                      : `${state.href}?age=${encodeURIComponent(age)}`,
                    selected: selected,
                    children: text`Grade ${age}`
                  }
                })
              }).filter(Boolean))}
            </header>
            <ul class="View-treads">
              ${threads.filter(function (doc) {
                if (state.query.age && doc.data.age !== state.query.age) {
                  return false
                }
                return doc.data.include !== 'Nej'
              }).map((thread) => html`
                <li class="View-tread">
                  ${card({
                    image: img(thread.data.image, { sizes: '35rem' }, {
                      sizes: [400, 800, 1000, 1200]
                    }),
                    title: thread.data.title ? asText(thread.data.title) : text`Namnlös utmaning`,
                    goal: thread.data.goal.data.number,
                    link: resolve(thread),
                    body: html`
                      ${truncate(asText(thread.data.description), 180)}
                      <br>
                      <br>
                      <strong>${text`Grade ${thread.data.age}`}</strong>
                    `
                  })}
                </li>
              `)}
            </ul>
          </div>
        </section>

        <div class="View-panel View-panel--white">
          <div class="u-container u-nbfc">
            ${gallery({ title: text`Inspiration`, items: doc.data.inspo })}
          </div>
        </div>

        <div class="View-panel View-panel--white">
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

        ${state.prismic.getSingle('website', function (err, website) {
          if (err) throw HTTPError(404, err)
          if (!website) return null

          return callout({
            title: asText(website.data.start_outro_heading),
            body: asElement(website.data.start_outro_body, resolve, serialize),
            link: '/start/om',
            linkText: website.data.start_outro_link_text
          })
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
