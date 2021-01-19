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
    <div class="Card Card--goal${props.goal} ${props.plain ? 'Card--plain' : ''} ${props.file ? 'Card--file' : ''} ${props.disabled ? 'is-disabled' : ''}">
      ${props.image || props.panel ? html`
        <div class="Card-panel ${props.image ? 'Card-panel--image' : ''}">
          ${props.image ? props.image : props.panel}
          ${props.disabled ? html`<span class="Card-warning">${props.disabled_text ? props.disabled_text : 'Kommer snart'}</span>` : null}
        </div>
      ` : null}
      ${props.plate && !props.image ? html`
        <div class="Card-panel Card-panel--image"><span class="Card-warning">${props.disabled_text ? props.disabled_text : 'Kommer snart'}</span></div>
      ` : null}
      <div class="Card-content">
        ${props.goal_third && !props.file ? html`
          <div class="Card-goal Card-goal--${props.goal_third}">${props.goal_third}</div>
        ` : null}
        ${props.goal_secound && !props.file ? html`
          <div class="Card-goal Card-goal--${props.goal_secound}">${props.goal_secound}</div>
        ` : null}
        ${props.goal && !props.file ? html`
          <div class="Card-goal Card-goal--${props.goal}">${props.goal}</div>
        ` : null}
        <div class="Card-title">${props.prefix ? html`<span class="Card-prefix">${props.prefix}</span>` : null}${props.title}</div>
        <div class="Card-body">${props.body}</div>
      </div>
      ${props.link && !props.disabled ? html`<a ${args} class="Card-link" href="${props.link}" onclick=${props.onclick}>${text`Visa mer`}</a>` : null}
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
