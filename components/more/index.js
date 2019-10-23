var html = require('choo/html')
var { text } = require('../base')

module.exports = more

function more (preamble, body) {
  return html`
    <details class="More">
      <summary class="More-summary">
        <div class="More-preamble">${preamble}</div>
        <span class="More-toggle">+ ${text`Läs mer`}</span>
      </summary>
      ${body}
    </details>
  `
}
