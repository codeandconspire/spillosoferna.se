var html = require('choo/html')
var view = require('../components/view')
var { Predicates } = require('prismic-javascript')
var accordion = require('../components/accordion')
var card = require('../components/card')
var serialize = require('../components/text/serialize')
var {
  img,
  text,
  asText,
  loader,
  resolve,
  HTTPError,
  asElement
} = require('../components/base')

module.exports = view(goals, meta, { floating: true })

function goals (state, emit) {
  return state.prismic.getSingle('goals', function (err, doc) {
    if (err) throw HTTPError(404, err)

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

    var goals = state.prismic.get(
      Predicates.at('document.type', 'goal'),
      { pageSize: 100, orderings: '[my.goal.number]' },
      function (err, res) {
        if (err || !res) return []
        return res.results
      }
    )

    if (!goals) {
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

    return html`
      <main class="View-main">
        <div class="View-page">
          <div class="u-container">
            <div class="Text Text--intro">
              <svg role="presentation" width="80" height="80" viewBox="0 0 80 80">
                <g fill="none" fill-rule="evenodd">
                  <path fill="#56C22B" d="M20.69 28.55c.99-1.68 2.2-3.22 3.57-4.58L12.55 11.15a40.3 40.3 0 00-7.44 9.66l15.58 7.74"/>
                  <path fill="#DDA63A" d="M49.3 19.64c1.78.81 3.43 1.85 4.93 3.08L66.03 9.9a40.02 40.02 0 00-10.46-6.5L49.3 19.64"/>
                  <path fill="#C5192D" d="M76.39 23.42l-15.6 7.78a22.56 22.56 0 011.57 5.5l17.34-1.63a39.91 39.91 0 00-3.31-11.65"/>
                  <path fill="#4C9F38" d="M59.44 28.81l15.68-7.75a40.01 40.01 0 00-7.33-9.65L55.96 24.2a22.4 22.4 0 013.48 4.6"/>
                  <path fill="#3F7E44" d="M17.56 40.09c0-.35.01-.7.04-1.06L.24 37.47a40.48 40.48 0 001.1 12.33l16.75-4.84c-.33-1.57-.53-3.2-.53-4.87"/>
                  <path fill="#FCC30B" d="M57.44 54.28a22.68 22.68 0 01-4.25 3.99l9.2 14.86a40.44 40.44 0 008.99-8.35l-13.94-10.5"/>
                  <path fill="#FF3A21" d="M62.42 40.1a22 22 0 01-.52 4.8l16.76 4.82a39.87 39.87 0 001.1-12.09l-17.35 1.65v.81"/>
                  <path fill="#FF9F24" d="M22.9 54.6L9.08 65.2a40.32 40.32 0 009.04 8.26l9.14-14.9a23.02 23.02 0 01-4.34-3.96"/>
                  <path fill="#0A97D9" d="M17.76 36.38c.3-1.95.89-3.81 1.67-5.56L3.74 23.09A39.05 39.05 0 00.28 34.83l17.48 1.55"/>
                  <path fill="#A21942" d="M60.29 74.31l-9.2-14.83a22.64 22.64 0 01-5.35 2.17l3.24 17.16a39.87 39.87 0 0011.3-4.5"/>
                  <path fill="#26BDE2" d="M61.35 47.15a23.07 23.07 0 01-2.44 5l13.9 10.47a39.7 39.7 0 005.25-10.67l-16.71-4.8"/>
                  <path fill="#FF6924" d="M43.34 62.12a22.88 22.88 0 01-5.88.09l-3.24 17.13a40.4 40.4 0 0012.36-.1l-3.24-17.12"/>
                  <path fill="#E8203A" d="M41.33 17.7c1.95.13 3.82.5 5.6 1.09L53.2 2.43A39.83 39.83 0 0041.33.18V17.7"/>
                  <path fill="#DD1367" d="M34.88 61.76a22.61 22.61 0 01-5.57-2.07L20.1 74.42c3.55 2.01 7.43 3.5 11.54 4.36l3.25-17.02"/>
                  <path fill="#19486A" d="M33.22 18.54c1.83-.57 3.76-.92 5.75-1.01V.17c-4.24.1-8.3.87-12.12 2.17l6.37 16.2"/>
                  <path fill="#BF8B2E" d="M21.48 52.66c-1.1-1.64-2-3.44-2.65-5.35L2.09 52.14A40.47 40.47 0 007.6 63.26l13.87-10.6"/>
                  <path fill="#00689D" d="M26.19 22.4a22.69 22.69 0 014.87-2.9L24.7 3.3a40.5 40.5 0 00-10.37 6.27L26.2 22.4"/>
                </g>
              </svg>
              <br><br>
              <h1>${doc ? asText(doc.data.title) : '…'}</h1>
              ${doc ? asElement(doc.data.description, resolve, serialize) : null}
            </div>
          </div>

          <div class="u-container">
            <ul class="View-goals">
              ${goals.map(function (goal) {
                var number = goal.data.number
                return html`
                  <li class="View-goalsItem">
                    <a class="View-goalsGoal" href="/malen/${number}">
                      <img src="${goal.data.icon.url}">
                    </a>
                  </li>
                `
              })}
            </ul>
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

        ${doc.data.resources.length ? html`
          <div class="View-panel View-panel--white">
            <div class="u-container u-nbfc">
              <div class="Text Text--small Text--wide">
                <h2>${text`Material för nedladdning`}</h2>
              </div>
              <div class="View-treads View-treads--wide">
                ${doc.data.resources.map(function (download) {
                  var hasImage = (download.file_image && download.file_image.url)

                  return html`
                    <div class="View-tread">
                      ${card({
                        image: hasImage ? img(download.file_image, { sizes: '35rem' }, {
                          sizes: [400, 800, 1000, 1200]
                        }) : img(doc.data.image, { sizes: '35rem' }, {
                          sizes: [400, 800, 1000, 1200]
                        }),
                        file: true,
                        title: download.file_title ? asText(download.file_title) : download.file.name,
                        link: download.file.url,
                        body: html`
                          <div>${download.file_desc ? asText(download.file_desc) : ''}</div>
                          <div><strong>Ladda ner</strong> (${bytesToSize(download.file.size)})</div>
                        `
                      })}
                    </div>
                  `
                 })}
              </div>
            </div>
          </div>
        ` : null}

      </main>
    `
  })
}

function meta (state) {
  return state.prismic.getSingle('goals', function (err, doc) {
    if (err) throw HTTPError(404, err)
    if (!doc) return null
    var props = {
      title: asText(doc.data.title),
      description: asText(doc.data.description)
    }

    return props
  })
}

function bytesToSize (bytes) {
  var sizes = ['bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Byte'
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
}
