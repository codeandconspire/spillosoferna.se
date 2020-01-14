var html = require('choo/html')
var Component = require('choo/component')
var { text, img } = require('../base')
var { clock } = require('../symbols')

module.exports = class Featured extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = {
      id,
      expanded: !state.skipintro
    }

    this.href = () => state.href
  }

  update () {
    return false
  }

  createElement (props) {
    var self = this

    return html`
      <article class="Featured ${this.local.expanded ? 'is-expanded' : ''}" id="${this.local.id}">
        ${this.local.expanded ? html`
          <div class="Featured-background">
            ${img(props.image, { class: 'Featured-image', sizes: '100vw' }, {
              sizes: [400, 600, 900, 1280, [1800, 'q_70'], [2560, 'q_50']],
              aspect: 0.3
            })}
          </div>
          <div class="Featured-body">
            <header class="Featured-header">
              <div class="Text">
                <h2 class="Featured-title">${props.title}</h2>
                <p>${props.body}</p>
              </div>
            </header>
            ${props.duration ? html`
              <div class="Featured-duration">
                <span class="Featured-symbol">${clock()}</span> ${props.duration}
              </div>
            ` : null}
          </div>
          <a href="${props.href}" class="Featured-link">${text`Läs mer`}</a>
          <a href="${this.href()}?skipintro=true" class="Featured-close" onclick=${onclick}>
            ${text`Dölj info`}
          </a>
        ` : html`
          <a class="Featured-button" href="${props.href}">
            <svg width="15" height="10" role="presentation">
              <g stroke="#000" stroke-width="2" fill="none" fill-rule="evenodd" stroke-linecap="round">
                <path d="M9.257 8.536L12.793 5 9.257 1.464M12.793 5H1.056"/>
              </g>
            </svg>
            ${text`Visa introduktion`}
          </a>
        `}
      </article>
    `

    function onclick (event) {
      self.local.expanded = false
      self.rerender()
      document.cookie = `spillo:skipintro=true; max-age=${60 * 60 * 24 * 365}`
      event.preventDefault()
    }
  }
}
