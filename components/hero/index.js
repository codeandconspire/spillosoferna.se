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
        ${props.title ? html`<h1 class="Hero-title">${props.title}</h1>` : null}
        ${props.body ? html`<p class="Hero-body">${props.body}</p>` : null}
      </div>
    </div>
  `
}

function loading () {
  return html`
    <div class="Hero is-loading">
      <div class="u-container">
        <div class="Hero-label">${loader(6)}</div>
        <div class="Hero-title">${loader(9)}</div>
        <p class="Hero-body">${loader(48)}</p>
      </div>
    </div>
  `
}
