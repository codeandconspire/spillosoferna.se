var html = require('choo/html')
var { text } = require('../base')

module.exports = lesson

function lesson (props) {
  return html`
    <details class="Lesson">
      <summary class="Lesson-summary">
        <div class="Text">
          <h2>${props.title ? props.title : ''}</h2>
        </div>
        <span class="Lesson-subtitle">
          ${props.subtitle ? props.subtitle : null}
          ${props.time ? html`
            <svg width="16" height="16"><g fill="#000" fill-rule="nonzero"><path d="M8 .5a7.5 7.5 0 100 15 7.5 7.5 0 000-15zM8 14A6 6 0 118 2a6 6 0 010 12z"/><path d="M11 7.25H8.75V5a.75.75 0 00-1.5 0v3c0 .414.336.75.75.75h3a.75.75 0 100-1.5z"/></g></svg>
            ${props.time}
          ` : null}
        </span>
      </summary>
      <div class="Lesson-content">
        <div class="Lesson-main">
          <div class="Text">
            <h3>${text`Introduktion`}</h3>
            ${props.main ? props.main : null}
          </div>
          ${props.steps ? html`
            <div class="Lesson-steps">
              <div class="Text">
                <h3>${text`Gör så här`}</h3>
              </div>
              <ol>
                ${props.steps.map(function (step) {
                  return html`
                    <li class="Lesson-step">
                      <div class="Text">
                        ${step.body}
                      </div>
                      ${step.note ? html`
                        <div class="Lesson-note">
                          <div class="Text Text--static">
                            <h4>${text`Till dig som pedagog`}</h4>
                            ${step.note}
                          </div>
                        </div>
                      ` : null}
                    </li>
                  `
                  })
                }
              </ol>
            </div>
          ` : null}
        </div>
        <div class="Lesson-aside">
          <div class="Text Text--static">
            ${props.preparation ? html`
              <div class="Text">
                <h3>${text`Förberedelser`}</h3>
              </div>
              <div class="Text Text--static">
                ${props.preparation}
              </div>
            ` : null}
          </div>
        </div>
      </div>
    </details>
  `
}
