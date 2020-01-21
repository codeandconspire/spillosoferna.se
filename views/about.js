var html = require('choo/html')
var view = require('../components/view')
var embed = require('../components/embed')
var serialize = require('../components/text/serialize')
var {
  asText,
  srcset,
  resolve,
  HTTPError,
  asElement
} = require('../components/base')

module.exports = view(about, meta)

function about (state, emit) {
  var internal = state.href === '/start/om'

  return html`
    <main class="View-main">
      <div class="View-page">
        ${state.prismic.getSingle('about', function (err, doc) {
          if (err) throw HTTPError(404, err)

          if (!doc) {
            return html`
              <div class="u-container">
                <div class="Text Text--intro">
                  <h1>…</h1>
                </div>
              </div>
            `
          }

          if (internal) {
            return html`
              <div class="u-container">
                <div class="Text Text--intro">
                  <h1>${asText(doc.data.internal_title)}</h1>
                  ${asElement(doc.data.internal_description, resolve, serialize)}
                </div>
                ${doc.data.internal_slices.map(asSlice)}
              </div>
            `
          } else {
            return html`
              <div class="u-container">
                <div class="Text Text--intro">
                  <h1>${asText(doc.data.public_title)}</h1>
                  ${asElement(doc.data.public_description, resolve, serialize)}
                </div>
                <div class="Text Text--intro">
                  ${doc.data.public_slices.map(asSlice)}
                </div>
              </div>
            `
          }
        })}
      </div>
    </main>
  `

  // render slice as element
  // (obj, num) -> Element
  function asSlice (slice, index, list) {
    switch (slice.slice_type) {
      case 'text': {
        if (!slice.primary.text.length) return null
        return html`
          <div class="Text Text--aligned">
            ${asElement(slice.primary.text, resolve, state.serialize)}
          </div>
        `
      }
      case 'quote': {
        return html`
          <div class="Text Text--aligned">
            <figure class="Text-blockquote">
              <blockquote>${asElement(slice.primary.text)}</blockquote>
              ${slice.primary.cite ? html`<figcaption class="Text-cite">${asText(slice.primary.cite)}</figcaption>` : null}
            </figure>
          </div>
        `
      }
      case 'image': {
        if (!slice.primary.image.url) return null
        var wide = slice.primary.width !== 'Spaltbredd'

        const sources = srcset(slice.primary.image.url, [400, 600, 900, [1600, 'q_60'], [3000, 'q_50']])
        const attrs = Object.assign({
          sizes: '100vw',
          srcset: sources,
          src: sources.split(' ')[0],
          alt: slice.primary.image.alt || ''
        }, slice.primary.image.dimensions)

        var caption = slice.primary.caption ? asText(slice.primary.caption) : slice.primary.image.copyright

        return html`
          <figure class="Text ${wide ? 'Text--wide' : ''} Text--margin Text--aligned">
            <img ${attrs}>
            ${caption ? html`<figcaption class="Text-caption">${caption}</figcaption>` : null}
          </figure>
        `
      }
      case 'video': {
        if (slice.primary.video.type !== 'video') return null
        const children = video(slice.primary.video)
        if (!children) return null
        return html`
          <div class="Text Text--wide Text--aligned Text--margin">
            ${children}
          </div>
        `
      }
      default: return null
    }
  }
}

// map props to embed player
// obj -> Element
function video (props) {
  var id = embed.id(props)
  if (!id) return null

  var provider = props.provider_name.toLowerCase()
  return embed({
    url: props.embed_url,
    title: props.title,
    src: `/media/${provider}/w_900/${id}`,
    width: props.thumbnail_width,
    height: props.thumbnail_height,
    sizes: '100vw',
    srcset: srcset(id, [400, 900, 1800, [2600, 'q_50'], [3600, 'q_30']], { type: provider })
  })
}

function meta (state) {
  var internal = state.href === '/start/om'

  return state.prismic.getSingle('about', function (err, doc) {
    if (err) throw HTTPError(404, err)
    if (!doc) return null
    var props = {
      title: internal ? asText(doc.data.internal_title) : asText(doc.data.public_title),
      description: internal ? asText(doc.data.internal_description) : asText(doc.data.public_description)
    }

    return props
  })
}
