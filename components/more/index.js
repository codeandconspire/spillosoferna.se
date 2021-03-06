var html = require('choo/html')
var { text } = require('../base')

module.exports = more

function more (preamble, body) {
  var id = 'more-' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
  return html`
    <div class="More">
      <input type="checkbox" id="${id}" class="More-checkbox" hidden>
      <div class="More-summary">
        <div class="More-preamble">${preamble}</div>
        <label for="${id}" class="More-toggle">+ ${text`Läs mer`}</label>
      </div>
      <div class="More-body">
        ${body}
      </div>
    </div>
  `
}
