var html = require('choo/html')
var Component = require('choo/component')

module.exports = class Accordion extends Component {
  constructor (id, state, emit, selected = 0) {
    super(id)
    this.local = state.components[id] = { id, selected }
  }

  update () {
    return true
  }

  createElement (props) {
    var id = this.local.id
    if (!props.items) {
      return null
    }

    function tick (event) {
      var input = document.getElementById(event.currentTarget.getAttribute('for'))
      if (input.checked) {
        input.checked = false
        event.preventDefault()
      }
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
              <input type="radio" name="${id}" id="radio-${id}-${index}" class="Accordion-checkbox" hidden>
              <div class="Accordion-details">
                <div class="Accordion-summary">
                  ${item.title}
                  <label for="radio-${id}-${index}" class="Accordion-toggle" onclick=${tick}></label>
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
}
