var html = require('choo/html')

module.exports = accordion

function accordion (props) {
  if (!props.items) {
    return null
  }

  return html`
    <section class="Accordion ${props.inline ? 'Accordion--inline' : ''}">
      ${props.title ? html`
        <div class="Text">
          <h2>${props.title}</h2>
        </div>
      ` : null}
      <div class="Accordion-items">
        ${props.items.map((item, index) => (item.title && item.body) ? html`
          <div>
            <input type="checkbox" id="${props.id}-${index}" class="Accordion-checkbox" hidden>
            <div class="Accordion-details">
              <div class="Accordion-summary">
                ${item.title}
                <label for="${props.id}-${index}" class="Accordion-toggle"></label>
              </div>
              <div class="Accordion-body Text">
                ${item.body}
              </div>
            </div>
          </div>
        ` : null)}
      </div>
    </section>
  `
}
