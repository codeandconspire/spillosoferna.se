var html = require('choo/html')
var { text } = require('../base')

module.exports = lesson

function lesson (props) {
  return html`
    <details class="Lesson">
      <summary class="Lesson-summary">
        <div class="Text">
          <h2>${props.title ? props.title : ''}</h2>
          ${props.extra ? html`<p style="margin-top: -0.7em">${props.extra}</p>` : null}
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
          ${props.main ? html`
            <div class="Text">
              <h3>${text`Introduktion`}</h3>
              ${props.main} 
            </div>
          ` : null}
          
          ${props.steps ? html`
            <div class="Lesson-steps" style=${props.main ? '' : 'margin-top: 0'}>
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
            ${props.file ? html`
              <div class="Text">
                <h3>${text`Material`}</h3>
              </div>
              <div class="Text Text--static">
                <a class="Text-download" href="${props.file.file.url}" download>
                  <svg viewBox="0 0 14 15">
                    <defs>
                      <filter id="a" width="103.3%" height="102.8%" x="-1.6%" y="-1.4%" filterUnits="objectBoundingBox">
                        <feOffset in="SourceAlpha" result="shadowOffsetOuter1"/>
                        <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="7"/>
                        <feColorMatrix in="shadowBlurOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
                      </filter>
                      <rect id="b" width="1280" height="1508" x="83" y="2605" rx="10"/>
                    </defs>
                    <g fill="none" fill-rule="evenodd">
                      <path fill="#FFE5F2" d="M-1243-880H197v2296h-1440z"/>
                      <g transform="translate(-1243 -2943)">
                        <use fill="#000" filter="url(#a)" xlink:href="#b"/>
                        <use fill="#FFF" xlink:href="#b"/>
                      </g>
                      <path fill="#FFF" stroke="#DADADA" d="M-251-22H29a5 5 0 015 5v50a5 5 0 01-5 5h-280a5 5 0 01-5-5v-50a5 5 0 015-5z"/>
                      <g fill="#000" fill-rule="nonzero" transform="translate(-3 -2)">
                        <rect width="13.33" height="1.67" x="3.33" y="15" rx=".83"/>
                        <path d="M3.33 15.83v-1.66a.83.83 0 111.67 0v1.66a.83.83 0 11-1.67 0zM15 15.83v-1.66a.83.83 0 111.67 0v1.66a.83.83 0 11-1.67 0zM10 12.5a.83.83 0 01-.48-.15L6.18 10a.83.83 0 11.97-1.36l2.85 2 2.83-2.14a.83.83 0 011 1.33l-3.33 2.5a.83.83 0 01-.5.17z"/>
                        <path d="M10 10.83a.83.83 0 01-.83-.83V3.33a.83.83 0 111.66 0V10c0 .46-.37.83-.83.83z"/>
                      </g>
                    </g>
                  </svg>
                  <div>
                    <strong>Ladda ner zip</strong>
                    <span>${bytesToSize(props.file.file.size)}</span>
                  </div>
                </a>
              </div>
            ` : null}
            </div>
          </div>
        
      </div>
    </details>
  `
}

function bytesToSize (bytes) {
  var sizes = ['bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Byte'
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
}
