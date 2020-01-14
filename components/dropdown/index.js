var html = require('choo/html')
var Component = require('choo/component')

module.exports = class Dropdown extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = { id, expanded: false }
  }

  update () {
    return true
  }

  unload () {
    this.local.expanded = false
  }

  createElement (heading, chidren) {
    var self = this

    return html`
      <details class="Dropdown" id="${this.local.id}" open=${this.local.expanded}>
        <summary class="Dropdown-heading" onclick=${onclick}>${heading}</summary>
        <div class="Dropdown-content">
          ${chidren}
        </div>
      </details>
    `

    function onclick (event) {
      self.local.expanded = !self.local.expanded
      self.rerender()
      event.preventDefault()
    }
  }
}
