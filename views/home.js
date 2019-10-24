var html = require('choo/html')
var asElement = require('prismic-element')
var view = require('../components/view')
var Signin = require('../components/signin')
var serialize = require('../components/text/serialize')
var {
  src,
  asText,
  loader,
  resolve,
  HTTPError
} = require('../components/base')

module.exports = view(home, meta)

function home (state, emit) {
  return state.prismic.getSingle('landing', function (err, doc) {
    if (err) throw HTTPError(404, err)
    if (!doc) {
      return html`
        <main class="View-main">
          <div class="Text">
            <h1>${state.partial ? asText(state.partial.data.title) : loader(16)}</h1>
            ${state.partial ? asElement(state.partial.data.description, resolve, serialize) : html`<p>${loader(48)}</p>`}
          </div>
        </main>
      `
    }

    return html`
      <main class="View-main">
        <div class="u-container">
          <div class="View-landing">
            <div class="View-info">
              <div class="Text">
                <h1>${asText(doc.data.title)}</h1>
                ${asElement(doc.data.description, resolve, serialize)}
                ${!doc.data.cta.isBroken && doc.data.cta.id ? html`
                  <p>
                    <a href="${resolve(doc.data.cta)}">${doc.data.cta_text || asText(doc.data.cta.data.title)}</a>
                  </p>
                ` : null}
              </div>
            </div>
            <div class="View-login">
              ${state.cache(Signin, 'landing-form').render()}
            </div>
          </div>
        </div>
      </main>
    `
  })
}

function meta (state) {
  return state.prismic.getSingle('landing', function (err, doc) {
    if (err) throw HTTPError(404, err)
    if (!doc) return null
    var props = {
      title: asText(doc.data.title),
      description: asText(doc.data.description)
    }

    var image = doc.data.featured_image
    if (image.url) {
      Object.assign(props, {
        'og:image': src(image.url, 1200),
        'og:image:width': 1200,
        'og:image:height': 1200 * image.dimensions.height / image.dimensions.width
      })
    }

    return props
  })
}
