var html = require('choo/html')
var error = require('./error')
var Header = require('../header')
var footer = require('../footer')
var Player = require('../embed/player')
var { text, asText } = require('../base')

module.exports = view

function view (render, getMeta = Function.prototype, props) {
  return function (state, emit) {
    return state.prismic.getSingle('website', function (err, doc) {
      var children, meta
      try {
        if (err) throw err
        children = render(state, emit)
        meta = getMeta(state)

        console.log(doc)

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
        <body class="View">
          ${state.cache(Header, 'header').render(state.href)}
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
