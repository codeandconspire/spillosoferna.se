var html = require('choo/html')
var { text } = require('../base')

module.exports = footer

function footer (state, props = {}) {
  return html`
    <footer class="Footer ${props.back ? 'Footer--center' : ''}" role="contentinfo">
      ${props.back ? html`
        <a href="${state.prev || '/start'}">${text`Tillbaka till start`}</a>
      ` : html`
        <div><span class="Footer-email"><a href="mailto:skola@spilloteket.se">skola@spilloteket.se</a></span></div>
        <div><a class="" href="/villkor">${text`Användarvillkor`}</a></div>
        <div><a target="_blank" href="https://www.spilloteket.se">${text`spilloteket.se`}</a></div>
        <div class="Footer-logos">
          <a class="Footer-logo1" target="_blank" href="https://www.arvsfonden.se/"><img src="/arvsfonden.png"></a>
          <a class="Footer-logo2" target="_blank" href="https://www.spilloteket.se"><img src="/spilloteket.png"></a>
        </div>
      `}
    </footer>
  `
}
