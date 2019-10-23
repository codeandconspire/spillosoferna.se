var html = require('choo/html')
var { loader } = require('../base')

module.exports = card
module.exports.loading = loading

function card (props) {
  var attrs = { ...props.image }
  delete attrs.src

  return html`
    <div class="Card">
      <div class="Card-panel ${props.image ? 'Card-panel--image' : ''}">
        ${props.image ? html`<img class="Card-image" ${attrs} src="${props.image.src}">
        ` : props.panel}
      </div>
      <div class="Card-content">
        <div class="Card-title">${props.title}</div>
        <div class="Card-body">${props.body}</div>
        </div>
      </div>
    </div>
  `
}

function loading () {
  return html`
    <div class="Card is-loading">
      <div class="Card-panel"></div>
      <div class="Card-content">
        <div class="Card-title">${loader(12)}</div>
        <div class="Card-body">${loader(20)}</div>
      </div>
    </div>
  `
}
