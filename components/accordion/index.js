var html = require('choo/html')

module.exports = accordion

function accordion (props) {
  if (!props.items) {
    return null
  }

  return html`
    <section class="Accordion">
      ${props.title ? html`
        <div class="Text">
          <h2>${props.title}</h2>
        </div>
      ` : null}
      <div class="Accordion-items">
        ${props.items.map((item) => (item.title && item.body) ? html`
          <details class="Accordion-details">
            <summary class="Accordion-summary">${item.title}</summary>
            <div class="Text">
              ${item.body}
            </div>
          </details>
        ` : null)}
      </div>
    </section>
  `
}
