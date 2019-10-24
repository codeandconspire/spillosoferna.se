var html = require('choo/html')
var { Elements } = require('prismic-richtext')
var { img, srcset } = require('../base')
var embed = require('../embed')

module.exports = serialize

function serialize (type, node, content, children) {
  switch (type) {
    case Elements.paragraph: {
      if (node.text === '' || node.text.match(/^\s+$/)) {
        return html`<!-- Empty paragraph node removed -->`
      }
      return null
    }
    case Elements.embed: {
      const provider = node.oembed.provider_name.toLowerCase()
      const id = embed.id(node.oembed)

      return embed({
        url: node.oembed.embed_url,
        title: node.oembed.title,
        src: `/media/${provider}/w_900/${id}`,
        width: node.oembed.thumbnail_width,
        height: node.oembed.thumbnail_height,
        sizes: '42rem',
        srcset: srcset(id, [400, 900, 1800], { type: provider })
      })
    }
    case Elements.image: {
      var attrs = {}
      var opts = {}
      if (!/\.(svg|gif)$/.test(node.url)) {
        attrs.sizes = '42rem'
        opts.sizes = [400, 800, 1000, 1200]
      }

      return html`
        <figure>
          ${img(node, attrs, opts)}
          ${node.alt ? html`<figcaption class="Text-caption">${node.alt}</figcaption>` : null}
        </figure>
      `
    }
    default: return null
  }
}
