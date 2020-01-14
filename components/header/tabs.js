var html = require('choo/html')
var nanoraf = require('nanoraf')
var Component = require('choo/component')

module.exports = class Tabs extends Component {
  constructor (id, state, emit, selected = 0) {
    super(id)
    this.local = state.components[id] = { id, selected }
  }

  update () {
    return true
  }

  load (el) {
    var anchors = this.local.anchors.map(function ({ id }) {
      var el = document.getElementById(id)
      return { el, offset: offset(el), height: el.offsetHeight }
    })

    var onscroll = nanoraf(() => {
      var { scrollY, innerHeight } = window
      var i = 0
      var last = anchors[anchors.length - 1]
      if (scrollY + innerHeight >= last.offset + last.height) {
        i = anchors.length - 1
      } else if (scrollY + innerHeight / 2 > anchors[i].offset + anchors[i].height) {
        for (let len = anchors.length; i < len; i++) {
          if (scrollY + innerHeight / 2 < anchors[i].offset + anchors[i].height) {
            break
          }
        }
      }
      this.local.selected = i
      this.rerender()
    })

    var onresize = nanoraf(function () {
      anchors.forEach(function (props) {
        props.height = props.el.offsetHeight
        props.offset = offset(props.el)
      })
    })

    onscroll()
    window.addEventListener('resize', onresize)
    window.addEventListener('scroll', onscroll)
    document.documentElement.addEventListener('click', onresize)

    this.unload = function () {
      window.removeEventListener('scroll', onscroll)
      window.removeEventListener('resize', onresize)
      document.documentElement.removeEventListener('click', onresize)
    }
  }

  createElement (anchors = []) {
    this.local.anchors = anchors
    return html`
      <nav class="Header Header--tabs">
        <div class="Header-bar">
          ${anchors.map(({ id, text }, index) => {
            return html`
              <a href="#${id}" class="Header-tab ${this.local.selected === index ? 'is-selected' : ''}" onclick=${onclick}>
                ${text}
              </a>
            `

            function onclick (event) {
              var el = document.getElementById(id)
              if (!el) return
              el.scrollIntoView({ behavior: 'smooth', block: 'start' })
              event.preventDefault()
            }
          })}
        </div>
      </nav>
    `
  }
}

function offset (el) {
  var parent = el
  var offset = el.offsetTop
  while ((parent = parent.parentElement)) {
    offset += parent.offsetTop
  }
  return offset
}
