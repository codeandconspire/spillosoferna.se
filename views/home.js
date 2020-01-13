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
        <svg class="View-abstract" viewBox="0 0 451 260">
          <path fill="#23A098" fill-rule="evenodd" d="M28 196l196-50c35-9 68 0 74 25 6 30 17 57 46 75 45 28 87 12 102-42 14-54-3-81-49-72-46 8-71-25-68-65 2-39 4-68-13-66s-42 47-66 54-37-3-47-18c-7-10-74 40-202 151l27 8z"/>
        </svg>
        <svg class="View-abstract View-abstract--2" viewBox="0 0 772 806">
          <path fill="#23A098" fill-rule="evenodd" d="M312 151c6-80 34-125 83-137 75-18 153-28 153 32 0 59-35 127-11 145 25 17 127-10 148-10s63 9 63 71-31 86 0 173 42 128-26 173c-67 44-328 166-410 190-82 25-169 36-269-50-101-86 1-219 46-251 45-31 100-21 109 55s22 161 60 161c37 0 119-53 86-161-32-108-206-104-231-128-24-24 18-93 69-81 52 12 175 134 296 154 122 20 176 13 155-62-20-76-71-151-155-134-83 17-129 38-156-9-18-32-22-75-10-131z"/>
        </svg>
        
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
