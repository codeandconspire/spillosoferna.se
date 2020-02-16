var html = require('choo/html')
var Component = require('choo/component')
var { text } = require('../base')

module.exports = class Featured extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = {
      id,
      expanded: !state.age
    }

    this.href = () => state.href
  }

  update () {
    return false
  }

  createElement (props) {
    var self = this

    return html`
      <div>
        <button type="submit" name="age" class="Featured-close" onclick=${onclick}>
          ${text`Dölj info`}
        </button>
        <button type="submit" name="age" class="Featured-close" onclick=${onclick}>
          ${text`Dölj info`}
        </button>
      </div>
    `

    function onclick (event) {
      self.local.selected = false
      self.rerender()
      document.cookie = `spillo:age=true; max-age=${60 * 60 * 24 * 365}`
      event.preventDefault()
    }
  }
}
