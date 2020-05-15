var html = require('choo/html')
var view = require('../components/view')
var embed = require('../components/embed')
var card = require('../components/card')
var accordion = require('../components/accordion')
var serialize = require('../components/text/serialize')
var {
  src,
  img,
  asText,
  text,
  srcset,
  truncate,
  resolve,
  HTTPError,
  asElement
} = require('../components/base')

module.exports = view(page, meta)

function page (state, emit) {
  return state.prismic.getByUID('page', state.params.slug, function (err, doc) {
    if (err) throw HTTPError(404, err)
    if (!doc) {
      return html`
        <main class="View-main">
          <div class="View-page">
            <div class="u-container">
              <div class="Text Text--intro">
                <h1>…</h1>
              </div>
            </div>
          </div>
        </main>
      `
    }

    return html`
      <main class="View-main">
        <div class="View-page">
          <div class="u-container">
            <div class="Text Text--intro">
              <h1>${asText(doc.data.title)}</h1>
              ${asElement(doc.data.description, resolve, serialize)}
            </div>
            ${doc.data.slices.map(asSlice)}
          </div>
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
        case 'featured_threads': {
          if (slice.items.length < 1) return null

          return html`
            <div class="View-threadsWrap View-threadsWrap--inline">
              <div class="View-threadsContent">
                <ul class="View-threads" style="justify-content: center">
                  ${slice.items.map(function (item, index) {
                    if (item.thread.isBroken) {
                      return null
                    }
                    return state.prismic.getByUID('thread', item.thread.uid, function (err, thread) {
                      if (err || !thread) return null
                      return html`
                        <li class="View-thread">
                          ${card({
                            image: thread.data.image.url ? img(thread.data.image, { sizes: '35rem' }, {
                              sizes: [400, 800, 1000, 1200]
                            }) : false,
                            plate: !thread.data.published,
                            disabled: !thread.data.published,
                            disabled_text: thread.data.upcoming_label,
                            title: thread.data.title ? asText(thread.data.title) : text`Namnlös utmaning`,
                            goal: thread.data.goal.data ? thread.data.goal.data.number : null,
                            goal_secound: thread.data.goal_secound.data ? thread.data.goal_secound.data.number : null,
                            goal_third: thread.data.goal_third.data ? thread.data.goal_third.data.number : null,
                            link: resolve(thread),
                            body: html`
                              <div style="margin-bottom: 0.75rem">${truncate(asText(thread.data.description), 180)}</div>
                              <div>
                                <strong>${text`Grade ${thread.data.age}`}</strong>
                                ${thread.data.subjects ? html`<br><span class="Text-muted">${thread.data.subjects}</span>` : null}
                              </div>
                            `
                          })}
                        </li>
                      `
                    })
                  })}
                </ul>
              </div>
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
        case 'faq': {
          if (slice.items.length < 1) return null
          return html`
            <div class="Text-accordion">
              ${accordion({
                id: 'faq-slice-' + index,
                inline: true,
                items: slice.items.map(function (item) {
                  return {
                    title: asText(item.faq_title),
                    body: asElement(item.faq_body, resolve, serialize)
                  }
                })
              })}
            </div>
          `
        }
        default: return null
      }
    }
  })
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
  return state.prismic.getByUID('page', state.params.slug, (err, doc) => {
    if (err) throw err
    if (!doc) return null
    var props = {
      title: asText(doc.data.title),
      description: asText(doc.data.description)
    }

    var image = doc.data.featured_image
    if (image && image.url) {
      Object.assign(props, {
        'og:image': src(image.url, 1200),
        'og:image:width': 1200,
        'og:image:height': 1200 * image.dimensions.height / image.dimensions.width
      })
    }

    return props
  })
}
