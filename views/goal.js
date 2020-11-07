var html = require('choo/html')
var { Predicates } = require('prismic-javascript')
var view = require('../components/view')
var card = require('../components/card')
var {
  asText,
  asElement,
  bytesToSize
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
        <div class="u-container" style="position: absolute; top: 0; left: 0;">
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
        <div class="u-container">
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
                goal: goal,
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

      ${doc.data.targets && doc.data.targets.length && doc.data.targets[0].title.length ? html`
        <div class="View-panel View-panel--tight" style="margin-top: 0;">
          <div class="u-container u-nbfc">
            <div class="Text">
              <h2>Utvalda delmål för mål ${goal} ${doc.data.targets_link && doc.data.targets_link.url ? html`– <a href="${doc.data.targets_link.url}" target="_blanl" title="På globalamålen.se">Se alla</a>` : null}</h2>
            </div>
            <ol class="View-targets ${goal ? `View-targets--${goal}` : ''}">
              ${doc.data.targets.map((item, index) => (item.title.length) ? html`
                <li class="View-targetsItem">
                  <div class="View-targetsIcon">
                    ${item.id ? html`<div class="View-targetsNumber">Delmål ${item.id}</div>` : null}
                    ${item.icon && item.icon.url ? html`<img src="${item.icon.url}" />` : null}
                  </div>

                  <div class="Text Text--smaller">
                    ${item.title.length ? asElement(item.title) : null}
                  </div>
                </li>
              ` : null)}
            </ol>
          </div>
        </div>
      ` : null}

      ${doc.data.tips && doc.data.tips.length && doc.data.tips[0].tips_title.length ? html`
        <div class="View-panel View-panel--spillo" style="margin-top: 0;">
          <div class="u-container u-nbfc">
            <div class="Text Text--center">
              <h1>Vad kan vi göra?</h1>
            </div>
            <ol class="View-tips">
              ${doc.data.tips.map((item, index) => (item.tips_title) ? html`
                <li class="View-tipsItem">
                  <div class="View-tipsIcon">
                    <svg viewBox="0 0 42 42">
                      <g fill="none" fill-rule="evenodd">
                        <path fill="#FFE5F2" d="M-418-435h1440v765H-418z"/>
                        <g>
                          <rect width="42" height="42" fill="#FFF" rx="21"/>
                          <path stroke="#23A098" stroke-width="2.8" d="M14.84 20.18l5.26 5.19 8.74-9.27"/>
                        </g>
                      </g>
                    </svg>
                  </div>
                  <div class="Text Text--center">
                    <h3>${item.tips_title}</h3>
                    ${item.tips_body ? asElement(item.tips_body) : null}
                  </div>
                </li>
              ` : null)}
            </ol>
          </div>
        </div>
      ` : null}

      <div class="View-panel View-panel--tight" style="margin-top: 0;">
        <div class="u-container u-nbfc">
          <div class="Text"><h2>Utforska fler mål</h2></div>
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
