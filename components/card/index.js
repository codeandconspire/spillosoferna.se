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
    <div class="Card Card--goal${props.goal} ${props.file ? 'Card--file' : ''} ${props.disabled ? 'is-disabled' : ''}">
      <div class="Card-panel ${props.image ? 'Card-panel--image' : ''}">
        ${props.image ? props.image : props.panel}
      </div>
      ${props.plate ? html`
        <div class="Card-panel Card-panel--image"></div>
      ` : null}
      <div class="Card-content">
        ${props.goal && !props.file ? html`
          <div class="Card-goal">${props.goal}</div>
        ` : null}
        <div class="Card-title">${props.prefix ? html`<span class="Card-prefix">${props.prefix}</span>` : null}${props.title}</div>
        <div class="Card-body">${props.body}</div>
      </div>
      ${props.link && !props.disabled ? html`<a ${args} class="Card-link" href="${props.link}">${text`Visa mer`}</a>` : null}
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
