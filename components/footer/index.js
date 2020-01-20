var html = require('choo/html')
var { text } = require('../base')

module.exports = footer

function footer (props = {}) {
  return html`
    <footer class="Footer ${props.back ? 'Footer--center' : ''}" role="contentinfo">
      ${props.back ? html`
        <a href="/start">${text`Tillbaka till start`}</a>  
      ` : html`
        <span class="Footer-email"><a href="mailto:kontakt@spilloteket.se">kontakt@spilloteket.se</a></span>
        <a class="" href="/terms">${text`Användarvillkor`}</a>
        <span class="Footer-copy">© ${(new Date()).getFullYear()}</span>
      `}
    </footer>
  `
}
