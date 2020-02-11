var html = require('choo/html')
var error = require('./error')
var Header = require('../header')
var footer = require('../footer')
var Player = require('../embed/player')
var { Predicates } = require('prismic-javascript')
var { text, asText } = require('../base')

module.exports = view

function view (render, getMeta = Function.prototype, props = {}) {
  return function (state, emit) {
    return state.prismic.getSingle('website', function (err, doc) {
      state.prismic.getSingle('goals', function (err, doc) {
        if (err) throw err
        if (!doc) return null
      })

      state.prismic.get(
        Predicates.at('document.type', 'goal'),
        { pageSize: 100, orderings: '[my.goal.number]' },
        function (err, res) {
          if (err || !res) return []
          return res.results
        }
      )

      var children, meta
      try {
        if (err) throw err
        children = render(state, emit)
        meta = getMeta(state)

        const title = doc ? asText(doc.data.title) : text`Loading`

        if (meta && meta.title && meta.title !== title) {
          meta.title = `${meta.title} – ${title}`
        }

        const defaults = {
          title: doc ? title : `${text`Loading`} – ${title}`,
          description: doc ? asText(doc.data.description) : null
        }

        if (doc && doc.data.featured_image && doc.data.featured_image.url) {
          defaults['og:image'] = doc.data.featured_image.url
          defaults['og:image:width'] = doc.data.featured_image.dimensions.width
          defaults['og:image:height'] = doc.data.featured_image.dimensions.height
        }

        emit('meta', Object.assign(defaults, meta))
      } catch (err) {
        err.status = state.offline ? 503 : err.status || 500
        children = error(err)
        emit('meta', {
          title: `${text`Hoppsan`}${doc ? ` – ${asText(doc.data.title)}` : ''}`
        })
      }

      return html`
        <body class="View ${props.floating ? 'View--floating' : ''}">
          ${!props.floating ? state.cache(Header, 'header').render(state.href) : html`
            <a class="View-close" href="/start">
              Stäng
              <svg viewBox="0 0 32 32">
                <g fill="none" fill-rule="evenodd"> 
                  <circle cx="16" cy="16" r="16" fill="#000"/>
                  <path stroke="#FFF" stroke-linecap="round" stroke-width="2" d="M11.09 11.05l9.9 9.9M20.99 11.05l-9.9 9.9"/>
                </g>
              </svg>
            </a>
          `}
          ${children}
          <div class="u-container">
            ${footer(props)}
          </div>
          ${Player.render()}
        </body>
      `
    })
  }
}
