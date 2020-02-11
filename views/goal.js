var html = require('choo/html')
var { Predicates } = require('prismic-javascript')
var view = require('../components/view')
var card = require('../components/card')
var {
  img,
  asText,
  asElement
} = require('../components/base')

module.exports = view(goal, meta, { floating: true, close: true })

function goal (state, emit) {
  var goal = state.params.uid
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
        <div class="View-hero View-hero--${goal}">
          <div class="u-container u-nbfc"></div>
        </div>
        <div class="u-container u-nbfc" style="position: absolute; top: 0; left: 0;">
          <div style="position: relative;">
            <a class="View-back" href="/malen">
              <svg role="presentation" viewBox="0 0 7 12"><path fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 1.75736L1.75736 6 6 10.24264" /></svg>
              Tillbaka
            </a>
          </div>
        </div>
      </main>
    `
  }

  var doc = goals[goal - 1]
  var download = doc.data.resources.length ? doc.data.resources[0] : null

  return html`
    <main class="View-main">
      <div class="View-hero View-hero--${goal}">
        <div class="u-container u-nbfc">
          <div class="Text Text--wide">
            <h1>
              <strong>Mål ${goal}</strong>
              <br>
              ${asText(doc.data.title)}
            </h1>
          </div>
          <div class="Text Text--large">
            <p>${asText(doc.data.description)}</p>
          </div>
        </div>
      </div>
      <div class="u-container u-nbfc" style="position: absolute; top: 0; left: 0;">
        <div style="position: relative;">
          <a class="View-back" href="/malen">
            <svg role="presentation" viewBox="0 0 7 12"><path fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 1.75736L1.75736 6 6 10.24264" /></svg>
            Tillbaka
          </a>
        </div>
      </div>

      <div class="View-panel View-panel--white View-panel--tight">
        <div class="u-container">
          <div style="position:relative">
            <div class="Text">
              ${asElement(doc.data.intro)}
            </div>
            <div class="View-panelAside">
              ${download ? card({
                image: download.file_image && download.file_image.url ? img(download.file_image, { sizes: '35rem' }, {
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
              }) : null}
            </div>
          </div>
        </div>
      </div>

    </main>
  `
}

function meta (state) {
  var goal = state.params.uid
  var goals = state.prismic.get(
    Predicates.at('document.type', 'goal'),
    { pageSize: 100, orderings: '[my.goal.number]' },
    function (err, res) {
      if (err || !res) return []
      return res.results
    }
  )

  if (!goals) return null
  var doc = goals[goal - 1]
  var props = {
    title: asText(doc.data.title),
    description: asText(doc.data.description)
  }

  return props
}

function bytesToSize (bytes) {
  var sizes = ['bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Byte'
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
}
