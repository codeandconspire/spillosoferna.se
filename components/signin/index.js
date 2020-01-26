var html = require('choo/html')
var Component = require('choo/component')
var { text } = require('../base')

module.exports = class Signin extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = Object.assign({
      id,
      error: state.error || null
    }, state.components[id])
  }

  update () {
    return false
  }

  createElement () {
    return html`
      <form method="POST" action="" class="Signin" id="${this.local.id}">
        <div class="Text Text--center">
          <h2>${text`Logga in med din kod`}</h2>
          ${this.local.error ? html`
            <strong>⚠️ ${text`Det funkade inte. Skrev du rätt kod?`}</strong>
          ` : null}
        </div>
        <label class="u-hiddenVisually" for="${this.local.id}-passcode">${text`Ange din kod`}</label>
        <div class="Signin-control">
          <input class="Signin-input" autocomplete="off" placeholder="0000" type="text" name="code" maxlength="4" minlength="4" pattern="\\d{4}" required>
        </div>
        <button class="Signin-button" type="Submit">${text`Logga in`}</button>
      </form>
    `
  }
}
