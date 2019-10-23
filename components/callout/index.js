var html = require('choo/html')

module.exports = callout

function callout (props) {
  return html`
    <section class="Callout">
      <div class="Callout-container u-container">
        <div class="Text Text--center">
          ${props.title ? html`<h1>${props.title}</h1>` : null}
          ${props.body ? props.body : null}
        </div>
        ${props.link && props.linkText ? html`
          <a class="Callout-button" href="${props.link}">${props.linkText}</a>
        ` : null}
      </div>
    </section>
  `
}
