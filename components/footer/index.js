var html = require('choo/html')
var { text } = require('../base')

module.exports = footer

function footer () {
  return html`
    <footer class="Footer" role="contentinfo">
      <span class="Footer-email"><a href="mailto:hej@spillosoferna.se">hej@spillosoferna.se</a></span>
      <a class="" href="/terms">${text`Användarvillkor`}</a>
      <span class="Footer-copy">© ${(new Date()).getFullYear()}</span>
    </footer>
  `
}
