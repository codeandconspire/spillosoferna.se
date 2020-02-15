var html = require('choo/html')
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
  HTTPError,
  asElement
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
          <svg class="View-abstract" viewBox="0 0 451 260">
            <path fill="#23A098" fill-rule="evenodd" d="M28 196l196-50c35-9 68 0 74 25 6 30 17 57 46 75 45 28 87 12 102-42 14-54-3-81-49-72-46 8-71-25-68-65 2-39 4-68-13-66s-42 47-66 54-37-3-47-18c-7-10-74 40-202 151l27 8z"/>
          </svg>
          <svg class="View-abstract View-abstract--2" viewBox="0 0 772 806">
            <path fill="#23A098" fill-rule="evenodd" d="M312 151c6-80 34-125 83-137 75-18 153-28 153 32 0 59-35 127-11 145 25 17 127-10 148-10s63 9 63 71-31 86 0 173 42 128-26 173c-67 44-328 166-410 190-82 25-169 36-269-50-101-86 1-219 46-251 45-31 100-21 109 55s22 161 60 161c37 0 119-53 86-161-32-108-206-104-231-128-24-24 18-93 69-81 52 12 175 134 296 154 122 20 176 13 155-62-20-76-71-151-155-134-83 17-129 38-156-9-18-32-22-75-10-131z"/>
          </svg>
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
        <svg class="View-abstract" viewBox="0 0 451 260">
          <path fill="#23A098" fill-rule="evenodd" d="M28 196l196-50c35-9 68 0 74 25 6 30 17 57 46 75 45 28 87 12 102-42 14-54-3-81-49-72-46 8-71-25-68-65 2-39 4-68-13-66s-42 47-66 54-37-3-47-18c-7-10-74 40-202 151l27 8z"/>
        </svg>
        <svg class="View-abstract View-abstract--2" viewBox="0 0 772 806">
          <path fill="#23A098" fill-rule="evenodd" d="M312 151c6-80 34-125 83-137 75-18 153-28 153 32 0 59-35 127-11 145 25 17 127-10 148-10s63 9 63 71-31 86 0 173 42 128-26 173c-67 44-328 166-410 190-82 25-169 36-269-50-101-86 1-219 46-251 45-31 100-21 109 55s22 161 60 161c37 0 119-53 86-161-32-108-206-104-231-128-24-24 18-93 69-81 52 12 175 134 296 154 122 20 176 13 155-62-20-76-71-151-155-134-83 17-129 38-156-9-18-32-22-75-10-131z"/>
        </svg>
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
                if (age === 'F-6') {
                  return null
                }

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
                    onclick: function (event) {
                      emit('pushState', event.currentTarget.href, { persistScroll: true })
                      event.preventDefault()
                    },
                    children: text`Grade ${age}`
                  }
                })
              }).filter(Boolean))}
            </header>
            <ul class="View-threads">
              ${threads.filter(function (doc) {
                if (doc.data.age !== 'F-6') {
                  if (state.query.age && doc.data.age !== state.query.age) {
                    return false
                  }
                }
                return doc.data.include !== 'Nej'
              }).sort(function (docPrev, docNext) {
                var docPrevGoal = docPrev.data.goal.data ? docPrev.data.goal.data.number : 0
                var docNextGoal = docNext.data.goal.data ? docNext.data.goal.data.number : 0
                return docPrevGoal - docNextGoal
              }).map((thread, index) => html`
                <li class="View-thread ${index === 0 ? 'View-thread--large' : ''}">
                  ${card({
                    image: thread.data.image.url ? img(thread.data.image, { sizes: '35rem' }, {
                      sizes: [400, 800, 1000, 1200]
                    }) : false,
                    plate: !thread.data.published,
                    disabled: !thread.data.published,
                    title: thread.data.title ? asText(thread.data.title) : text`Namnlös utmaning`,
                    prefix: index === 0 ? text`Börja här` : false,
                    goal: thread.data.goal.data ? thread.data.goal.data.number : null,
                    link: resolve(thread),
                    body: html`
                      <div style="margin-bottom: 0.75rem">${truncate(asText(thread.data.description), 180)}</div>
                      <div>
                        <strong>${text`Grade ${thread.data.age}`}</strong>
                        ${thread.data.subjects ? html`<br><span class="Text-muted">${thread.data.subjects}</span>` : null}
                      </div>
                    `
                  })}
                </li>
              `)}
            </ul>
          </div>
        </section>

        <div class="View-panel View-panel--white">
          <div class="u-container u-nbfc" id="start-gallery">
            ${gallery({ title: text`Inspiration`, items: doc.data.inspo })}
          </div>
        </div>

        <div class="View-panel View-panel--white">
          <div class="u-container u-nbfc">
            ${accordion({
              title: text`Vanliga frågor`,
              id: 'start-faq',
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
