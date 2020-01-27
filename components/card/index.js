var html = require('choo/html')
var { loader, text } = require('../base')

module.exports = card
module.exports.loading = loading

function card (props) {
  var args = {}
  if (props.file) {
    args.download = true
  }

  return html`
    <div class="Card ${props.file ? 'Card--file' : ''}">
      <div class="Card-panel ${props.image ? 'Card-panel--image' : ''}">
        ${props.image ? props.image : props.panel}
      </div>
      <div class="Card-content">
        ${props.goal ? html`
          <div class="Card-goal Card-goal--${props.goal}">${props.goal}</div>
        ` : null}
        <div class="Card-title">${props.title}</div>
        <div class="Card-body">${props.body}</div>
      </div>
      ${props.link ? html`<a ${args} class="Card-link" href="${props.link}">${text`Visa mer`}</a>` : null}
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
