var html = require('choo/html')
var { text } = require('../base')

module.exports = header

function header () {
  return html`
    <header class="Header">
      <a href="/">${text`Till startsidan`}</a>
    </header>
  `
}
