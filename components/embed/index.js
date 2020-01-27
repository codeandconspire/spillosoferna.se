var assert = require('assert')
var html = require('choo/html')
var player = require('./player')
var { text } = require('../base')

// match short and long youtube links
// https://www.youtube.com/watch?foo=bar&v=WwE7TxtoyqM&bin=baz
// https://youtu.be/gd6_ZECm58g
var YOUTUBE_RE = /https?:\/\/(?:www.)?youtu\.?be(?:\.com\/watch\?(?:.*?)v=|\/)(.+?)(?:&|$)/

module.exports = embed
module.exports.id = id

function embed (props) {
  assert(props.src, 'figure: src string is required')
  var src = props.src
  var { width, height, srcset, sizes, alt = props.title || '' } = props
  var attrs = { width, height, srcset, sizes, alt }

  return html`
    <figure class="Embed ${props.size ? `Embed--${props.size}` : ''}">
      <a class="Embed-link" href="${props.url}" target="_blank" rel="noopener noreferrer" onclick=${onclick}>
        <span class="u-hiddenVisually">${text`Spela ${props.title || ''}`}</span>
      </a>
      <img class="Embed-image" ${attrs} src="${src}">
    </figure>
  `

  function onclick (event) {
    if (typeof props.onplay === 'function') props.onplay()
    player.render(props.url, props.onstop)
    event.preventDefault()
  }
}

// extract unique embed id
// obj -> str
function id (props) {
  switch (props.provider_name) {
    case 'YouTube': {
      const match = props.embed_url.trim().match(YOUTUBE_RE)
      return match ? match[1] : null
    }
    case 'Vimeo': return props.embed_url.trim().match(/vimeo\.com\/(.+)?\??/)[1]
    default: return null
  }
}
