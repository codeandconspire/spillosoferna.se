var html = require('choo/html')
var { Predicates } = require('prismic-javascript')
var view = require('../components/view')
var card = require('../components/card')
var pills = require('../components/pills')
var gallery = require('../components/gallery')
var callout = require('../components/callout')
var Dropdown = require('../components/dropdown')
var Featured = require('../components/featured')
var Accordion = require('../components/accordion')
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

    var featured = doc.data.featured_thread.id && threads
      ? threads.find((thread) => thread.id === doc.data.featured_thread.id)
      : null

    var options = AGES.map(function (age) {
      if (age === 'F-6') {
        return null
      }
      var predicates = [
        Predicates.at('my.thread.age', age),
        Predicates.at('my.thread.include', 'Ja')
      ]

      return state.prismic.get(predicates, { pageSize: 1 }, function (err, res) {
        if (err || !res || !res.results_size) return null

        var cookie = false
        if (typeof document !== 'undefined') {
          cookie = document.cookie ? document.cookie.split('; ').find(row => row.startsWith('spillo:age')).split('=')[1] : false
        }
        state.age = state.query.age ? state.query.age : cookie
        var selected = age === state.age
        return {
          href: selected
            ? state.href
            : `${state.href}?age=${encodeURIComponent(age)}`,
          selected: selected,
          name: 'age',
          onclick: function (event) {
            emit('pushState', event.currentTarget.href, { persistScroll: true })
            state.age = age
            document.cookie = `spillo:age=${age}; max-age=${60 * 60 * 24 * 365}`
            event.preventDefault()
          },
          children: text`Grade ${age}`
        }
      })
    }).filter(Boolean)

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
          <div class="u-container" style="overflow: hidden; padding-bottom: 2rem;">
            <div class="View-threadsWrap">
              ${!state.age ? html`
                <div class="View-alpha"></div>
                <div class="View-overlay">
                  <div class="Text">
                    ${doc.data.age_question ? html`<h2>${doc.data.age_question}</h2>` : null}
                    ${doc.data.age_question_desc ? asElement(doc.data.age_question_desc) : null}
                  </div>
                  <form action="${this.href}" method="POST" onsubmit=${(event) => event.preventDefault()}>
                    ${pills({ large: true, items: options })}
                  </form>

                  <svg class="View-ageArt" viewBox="0 0 379 157">
                    <g fill="none" fill-rule="evenodd">
                      <path fill="#DFAAC3" d="M162.4 75.51c0 7.82-1.72 30.75 2.48 36.24 5.1 6.68 18.01 8.31 18.01-18.1 0-4 14.6-2.87 14.45 4.51-.6 28.52 23.42 18.77 18.22 1.53-2.34-7.76 2.46-14.85 2.46-24.18 0-17.33-12.45-31.38-27.81-31.38s-27.8 14.05-27.8 31.38"/>
                      <path fill="#FBF078" d="M169.69 75.85c-.12 12.15 8.76 24.38 19.87 24.49 11.1.1 20.22-11.95 20.33-24.1.12-12.14-8.8-19.78-19.9-19.88-11.1-.11-20.18 7.35-20.3 19.5"/>
                      <path fill="#DFAAC3" d="M170.4 69.73s18.18-4.2 19.3-13.34c0-.06-6.13-1-12.77 3.86-5.23 3.82-6.53 9.48-6.53 9.48M208.96 69.67s-18.11-4.17-19.23-13.3c0-.05 6.27-1.1 12.89 3.75 5.2 3.8 6.34 9.55 6.34 9.55"/>
                      <path fill="#FBF078" d="M180.67 96.98l-6.78 14.63 14.89 7.91 15.02-4.06 1.66-4.63-6.98-14.27z"/>
                      <path stroke="#1B5B61" stroke-linecap="round" stroke-width="4" d="M113.53 66.17l-.04-.56"/>
                      <path fill="#F5D3DA" d="M35.95 98.44l-6.8 14.63 14.9 7.91 15.03-4.06 1.66-4.63-6.98-14.27z"/>
                      <path fill="#F5D3DA" d="M22.34 77.8c1.58 13.16 12.91 25.16 24.95 23.72 12.04-1.44 20.22-15.77 18.65-28.94-1.58-13.17-12.32-20.19-24.36-18.74-12.03 1.44-20.81 10.79-19.24 23.95"/>
                      <path fill="#1B5B61" d="M314.02 77.15c.04 12.7 9.48 25.37 21.09 25.34 11.6-.03 20.98-12.75 20.95-25.45-.03-12.7-9.46-20.57-21.07-20.54-11.6.03-21 7.95-20.97 20.65"/>
                      <path fill="#00A450" d="M25.67 86.73c-10.4.45-6.63-6.56-8.22-8.02-6.05-5.59 2.4-9.03 2.4-9.03s-1.64-5.37 3.83-5.77c.71-.05-2.24-5.76 5.3-6.95 2.18-.34-.17-5.57 8.34-4.52 1.33.17 3.59-5.1 11.25-2.44 0 0 1.86.94 4.97-.19 4.68-1.7 6.36 5.4 6.36 5.4s6.81.08 6.23 8.03c0 0 3.5 5.62-.44 8.34-1.97 1.36-5.7.5-8.74-2.17-1.2-1.07-5.2 2.57-9.3 3.1-2.84.38-3.37-3.44-5.5-3.96-2.56-.61-2.37 2.52-3.2 3.52-1.3 1.56-4.44 1-3.89 6.54.17 1.77-1.27 5.42-6.06 5.37-2.2-.02-2.39 2.71-3.33 2.75"/>
                      <path fill="#1B5B61" d="M343.42 98.8l6.79 14.62-14.9 7.91-15.02-4.06-1.66-4.63 6.99-14.27z"/>
                      <path fill="#DFAAC3" d="M378.39 156.52v-23.58c-1.42-12.87-12.64-24.24-27.37-25.92-1.9-.22-3.22-.4-3.98-.33 0 0-4.61 3.65-13.1 3.6-10.28-.07-12.49-3.28-12.49-3.28-.15-.08-1.64-.38-2.71-.8-7.35-2.81-18.82-7.7-31.14-25.4l-14.44-19.35s-5.06-7.29-8.52-1.86c-.97 1.53-4.03 5.67-.22 10.97 0 0 9.65-3.46 2.77 11.43 0 0 30.08 35.55 30.84 47.13.44 6.61.04 27.38.04 27.38h80.32z"/>
                      <path fill="#1B5B61" d="M282.37 73.8l-9.21-12.34s-5.06-7.29-8.52-1.86c-.97 1.53-4.03 5.67-.22 10.97 0 0 9.65-3.46 2.77 11.43 0 0 2.93 3.74 4.8 5.84.06.08 10.38-14.03 10.38-14.03"/>
                      <path fill="#1C4087" d="M.98 156.16V132.6c1.41-12.87 12.64-24.24 27.37-25.93 1.89-.21 3.22-.4 3.98-.33 0 0 4.6 3.65 13.1 3.6 10.28-.06 12.49-3.27 12.49-3.27.15-.08 1.64-.38 2.71-.8 7.35-2.82 18.82-7.7 31.14-25.4l14.44-19.35s5.06-7.29 8.51-1.86c.98 1.53 4.17 6.14.36 11.44 0 0-9.78-3.93-2.9 10.96 0 0-30.08 35.55-30.85 47.13-.43 6.61-.04 27.37-.04 27.37l-80.31.01z"/>
                      <path fill="#2D978C" d="M268.81 71.04c-.48-.45-.85-.95-2.64-.82-.67.05-1.75.33-1.75.33s-1.49-1.74-1.84-4.33a6.56 6.56 0 01.35-3.23c.26-.79.6-1.65 1.29-2.7.38-.6 1-1.8 1.84-2.2 0 0 .04-1.23-2.01-1.43-.99-.1-2.9.94-3.6 1.64-2.76 2.74-8.66 12.9-8.66 12.9l-7.3 11.5s-8.54 13.1-17.96 23.04c-2.22 2.33-22.84 1.67-22.84 1.67s-.62 4.57-14 4.69c-11.56.1-13.84-4.77-13.84-4.77s-20.95 1.13-26.45-4.89c-8.34-9.15-15.25-19.65-15.25-19.65l-6.89-11.59s-5.9-10.16-8.65-12.9c-.7-.7-2.62-1.74-3.6-1.64-2.06.2-2.01 1.31-2.01 1.31 1.08.59 1.87 2.04 1.87 2.04s1.09 1.67 1.4 2.74c.43 1.48.48 2.85.34 3.71-.4 2.49-1.78 4.11-1.78 4.11s-.75-.27-1.83-.34c-1.54-.1-2.27.49-2.67.95-.7.8-.78 1.96-.7 3.04.22 3.45 2.58 8.1 2.58 8.1s37.1 44.57 37.1 47.25c.05 9.75.06 26.94.06 26.94l40.15.03 40.15-.02s-.06-20.06 0-26.94c.02-2.37 29.5-35.38 37.36-47.49a16.98 16.98 0 002.58-7.45c.12-.95.16-2.7-.8-3.6"/>
                      <path fill="#FBF078" d="M268.81 71.04c-.48-.45-.85-.95-2.64-.82-.67.05-1.75.33-1.75.33s-1.49-1.74-1.84-4.33a6.56 6.56 0 01.35-3.23c.26-.79.6-1.65 1.29-2.7.38-.6 1-1.8 1.84-2.2 0 0 .04-1.23-2.01-1.43-.99-.1-2.9.94-3.6 1.64-2.76 2.74-8.66 12.9-8.66 12.9s11.46 16.2 11.54 16.08c2.09-2.78 1.86-2.4 3.7-5.19a16.82 16.82 0 002.58-7.45c.12-.95.16-2.7-.8-3.6M371.41 123.6c3.22-2.01 3.3-14.29-2.98-25.02-1.78-3.04 1.1-11.05.68-14.7-.63-5.61-7.95-12.23-10.32-20.08-1.08-3.6-7.74-8.6-11.35-9.9-3.72-1.34-11.72.17-15.55 1.13-3.28.83-9.46 3.8-12.27 5.68-2.2 1.46-6.26 7.1-5.8 8.83.72 2.76 7.78 1.6 10.55.92 2.79-.68 7.71-4.18 10.9-3.57 1.63.3 5.3 2.66 5.79 4.43.78 2.79-1.03 8.83.05 11.52.75 1.88 4.33 3.87 5.2 5.84.77 1.76.64 5.56 1.94 7.28.98 1.3 4.19 2.41 5.22 3.77 1.38 1.84 2.02 6 2.02 8.49 0 12.14 11 18.45 15.92 15.38M167.12 82.06c1.43 2.5 3.38 2.69 5.03 1.74 1.65-.94 1.83-3.73.4-6.23-1.42-2.5-3.92-3.76-5.57-2.81-1.65.94-1.3 4.8.14 7.3M212.27 82.06c-1.43 2.5-3.39 2.69-5.04 1.74-1.65-.94-1.83-3.73-.4-6.23 1.43-2.5 3.92-3.76 5.57-2.81 1.66.94 1.3 4.8-.13 7.3"/>
                      <path fill="#43AF64" d="M102.4 12.56c-1.91 6.38.26 9.95 3.94 11.05 3.67 1.1 7.45-.7 9.35-7.08 1.91-6.39.41-15.18-2.45-16.03-2.83-.85-8.94 5.67-10.85 12.06M88.78 31.25c5.12 2.48 8.43 1.14 9.87-1.8 1.43-2.95.43-6.39-4.69-8.87-5.12-2.5-12.74-2.44-13.86-.14-1.1 2.27 3.56 8.32 8.68 10.8M91.68 44.5c3.8-.36 5.22-2.27 5.02-4.45-.2-2.18-1.97-3.8-5.75-3.45-3.79.36-8.13 3.03-7.97 4.73.16 1.68 4.92 3.52 8.7 3.17M125.16 28.8c-1.38 5.28.5 8.15 3.54 8.94 3.05.8 6.1-.78 7.47-6.07 1.38-5.28-.1-12.45-2.47-13.07-2.34-.6-7.16 4.91-8.54 10.2M135.7 43.96c-3.78-2.08-6.33-1.2-7.53.98-1.2 2.17-.57 4.8 3.2 6.87 3.77 2.08 9.53 2.34 10.46.65.92-1.68-2.36-6.43-6.14-8.5M112.98 27.47c-2.72 2.07-2.84 4.29-1.58 5.94 1.27 1.65 3.44 2.12 6.15.04 2.72-2.07 4.69-6.27 3.7-7.56-.97-1.27-5.55-.5-8.27 1.58"/>
                      <path fill="#1B5B61" d="M88.88 23.4c3.33 1.63 6.61 3.36 9.85 5.22 1.6.95 3.21 1.9 4.78 2.98.4.25.78.54 1.17.83.39.27.77.57 1.15.9l.57.48.56.56c.37.32.75.9 1.1 1.44a1.48 1.48 0 11-2.52 1.58l-.24-.38c-.15-.24-.2-.5-.5-.83l-.34-.48-.44-.47a12.5 12.5 0 00-.92-.94c-.32-.31-.64-.63-.98-.92a73.29 73.29 0 00-4.23-3.5c-2.92-2.25-5.93-4.4-9-6.48M106.72 43.08c-.1-.1-.43-.32-.67-.47a17 17 0 00-2.72-1.22c-1.3-.44-2.67-.73-4.06-.93-1.4-.22-2.83-.28-4.26-.32l-2.16.03-2.16.15 2.12-.52 2.14-.4c1.45-.22 2.91-.41 4.4-.44 1.48-.04 2.99 0 4.5.24a19.56 19.56 0 013.41.87c.4.17.72.28 1.22.58l.17.1a1.53 1.53 0 11-1.93 2.33"/>
                      <path fill="#1B5B61" d="M115.4 30.07a96.32 96.32 0 00-3.77 3.65c-.6.63-1.2 1.26-1.75 1.9a8.82 8.82 0 00-1.3 1.84 1.53 1.53 0 11-2.56-1.6l.06-.07c.82-.9 1.56-1.34 2.33-1.87.76-.5 1.53-.95 2.3-1.39 1.55-.87 3.1-1.68 4.68-2.46M130.98 28.33a43.28 43.28 0 01-1.88 7.87 43.47 43.47 0 01-3.31 7.45 33.13 33.13 0 01-4.93 6.65 29.8 29.8 0 01-6.66 5.17 1.5 1.5 0 11-1.43-2.64l.1-.05a27.22 27.22 0 006.44-4.11 31.22 31.22 0 005.2-5.82 42.87 42.87 0 006.47-14.52"/>
                      <path fill="#1B5B61" d="M134.94 48.48l-5.08-1.46-2.54-.7-1.27-.33-.61-.15-.29-.06-.1-.02h-.03l.05.02.06.02.12.01a1.45 1.45 0 001.5-.99 1.5 1.5 0 01-2.83-1c.08-.26.42-.74.92-.9.24-.09.47-.1.64-.09l.12.02h.02l.13.04.13.04.06.02a3 3 0 01.2.1l.33.17.6.34 1.14.7 2.26 1.4 4.47 2.82z"/>
                      <path fill="#FBF078" d="M131.42 78.2l-4.16-7s-5.9-10.16-8.65-12.9c-.7-.7-2.62-1.74-3.6-1.64-1.29.12-1.75.6-1.92.95.57.3 1.12.83 1.63 1.64.98 1.53 4.17 6.14.36 11.44 0 0-.8-.32-1.77-.43a6.77 6.77 0 00-.82-.03h-.04c-.33.02-.61.07-.86.14h-.03l-.3.12-.06.03a2.74 2.74 0 00-.36.2l-.1.07c-1.25.99-1.7 3.51.8 9.43a2.47 2.47 0 013.55 2.03c.13 1.46.23 2.78.3 4.02.77.91 1.65 1.94 2.61 3.03.05.05 13.42-11.1 13.42-11.1"/>
                      <path fill="#FAF291" d="M111.26 70.49l-.06.03.06-.03M111.6 70.37h-.04.03zM110.33 71.18c-.7.8-.78 1.96-.7 3.04.13 2.02 1 4.45 1.69 6.12l.23-.12c-2.51-5.92-2.06-8.44-.8-9.43-.17.13-.31.26-.42.39M112.45 70.23h.04-.04M114.87 60.02s1.09 1.66 1.4 2.74a9 9 0 01.34 3.7 9.22 9.22 0 01-1.78 4.11s-.61-.22-1.52-.31c.97.11 1.77.43 1.77.43 3.81-5.3.62-9.91-.36-11.44a4.64 4.64 0 00-1.63-1.64c-.1.2-.1.36-.1.36 1.1.59 1.88 2.05 1.88 2.05"/>
                      <path fill="#1B5B61" d="M112 81.87L110.21 84c.31 3.8.4 6.73.46 9.34.11 4.15.2 7.74 1.11 13.2a2.5 2.5 0 104.94-.81c-.85-5.13-.95-8.56-1.05-12.52-.06-2.04-.12-4.27-.28-6.94-1.96-2.34-3.19-3.94-3.19-3.94l-.22-.46"/>
                      <path fill="#F5D3DA" d="M116.27 62.76c-.31-1.08-1.4-2.74-1.4-2.74s-.79-1.46-1.87-2.05c0 0 0-.16.1-.36-3.23-1.77-6.89 3.5-6.89 3.5l-8.43 11.3s9.33 15.43 9.41 15.32a334.31 334.31 0 014.8-5.86c-.16-.35-.4-.88-.67-1.53-.7-1.67-1.56-4.1-1.7-6.12-.07-1.08.01-2.23.71-3.04.11-.13.25-.26.42-.4l.09-.05a2.85 2.85 0 01.36-.21l.06-.03.3-.11.03-.01c.28-.08.57-.13.86-.14h.04c.28-.01.55 0 .82.03.9.1 1.52.31 1.52.31s1.37-1.62 1.78-4.1c.14-.87.09-2.24-.34-3.71"/>
                      <path fill="#FBF078" d="M112.38 79.99c-.3.02-.58.1-.83.23l.63 1.43-.19.22.22.46s1.23 1.6 3.19 3.94a141.6 141.6 0 00-.3-4.02 2.5 2.5 0 00-2.72-2.26"/>
                      <path fill="#FAF291" d="M112 81.87l.18-.22c-.23-.5-.44-.97-.63-1.43l-.23.12c.26.65.5 1.18.67 1.53"/>
                      <path fill="#1B5B61" d="M113.08 61.03a16.8 16.8 0 00-1.37-6.58l-2.97-6.93c-1-2.36-1.88-4.81-2.54-7.33a34.25 34.25 0 01-.55-15.4 84.96 84.96 0 014.22-14.56A84.44 84.44 0 00106.88 25c-.57 4.92.09 9.88 1.72 14.48 1.57 4.62 4.19 8.85 6.52 13.43a20.94 20.94 0 012.33 7.97c.21 2.86-.31 5.78-1.32 8.42-.2.52-.6 1.48-1.3 1.28-2.85-.8-3.93.1-3.92.1.45-.84 2.14-7.46 2.17-9.64"/>
                    </g>
                  </svg>
                </div>
              ` : null}
              <div class="View-threadsContent ${!state.age ? 'is-overlayed' : ''}">
                <header class="View-header">
                  <div class="View-heading">
                    <div class="Text">
                      <h2>${text`Utmaningar`}</h2>
                    </div>
                  </div>
                  <form action="${this.href}" method="POST" onsubmit=${(event) => event.preventDefault()}>
                    ${pills({ large: false, items: options })}
                  </form>
                </header>
                ${threads.length ? html`
                  <ul class="View-threads">
                    ${threads.filter(function (doc) {
                      if (doc.data.include === 'Nej') {
                        return false
                      }

                      if (doc.data.age === 'F-6') {
                        return true
                      }

                      if (state.age) {
                        if (state.age !== doc.data.age) {
                          return false
                        }
                      } else {
                        if (doc.data.age !== 'F-6' && doc.data.age !== '4-6') {
                          return false
                        }
                      }

                      return true
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
                          disabled_text: thread.data.upcoming_label,
                          title: thread.data.title ? asText(thread.data.title) : text`Namnlös utmaning`,
                          prefix: index === 0 ? text`Börja här` : false,
                          goal: thread.data.goal.data ? thread.data.goal.data.number : null,
                          goal_secound: thread.data.goal_secound.data ? thread.data.goal_secound.data.number : null,
                          goal_third: thread.data.goal_third.data ? thread.data.goal_third.data.number : null,
                          link: resolve(thread),
                          onclick: function (event) {
                            state.beforeThreadScroll = document.documentElement.scrollTop
                            emit('pushState', resolve(thread))
                            event.preventDefault()
                          },
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
                ` : null}
              </div>
            </div>
          </div>
        </section>

        <div class="View-panel View-panel--white">
          <div class="u-container u-nbfc" id="start-gallery">
            ${gallery({ title: text`Inspiration`, items: doc.data.inspo })}
          </div>
        </div>

        <div class="View-panel View-panel--white">
          <div class="u-container u-nbfc">
            ${state.cache(Accordion, 'start-faq').render({
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
