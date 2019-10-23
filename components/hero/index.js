var html = require('choo/html')
var { loader } = require('../base')

module.exports = hero
module.exports.loading = loading

function hero (props) {
  var attrs = { ...props.image }
  delete attrs.src

  return html`
    <div class="Hero">
      <div class="u-container">
        <img class="Hero-image" ${attrs} src="${props.image.src}">
        ${props.label ? html`<div class="Hero-label">${props.label.symbol ? html`
            <span class="Hero-symbol">${props.label.symbol}</span>${props.label.text}
        ` : props.label}</div>` : null}
        <div class="Text">
          ${props.title ? html`<h1>${props.title}</h1>` : null}
          ${props.body ? html`<p>${props.body}</p>` : null}
        </div>
      </div>
    </div>
  `
}

function loading () {
  return html`
    <div class="Hero is-loading">
      <div class="u-container">
        <div class="Hero-label">${loader(6)}</div>
        <div class="Text">
          <h1>${loader(6)}</h1>
          <p>${loader(9)}</p>
        </div>
      </div>
    </div>
  `
}
