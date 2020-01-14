var html = require('choo/html')

module.exports = pills

function pills (items) {
  return html`
    <ol class="Pills">
      ${items.map(function (item) {
        var attrs = Object.assign({
          class: `Pills-item ${item.selected ? 'is-selected' : ''}`
        }, item)
        delete attrs.children
        delete attrs.selected
        return html`
          <li class="Pills-pill">
            ${child(attrs, item.children)}
          </li>
        `
      })}
    </ol>
  `
}

function child (attrs, children) {
  if (attrs.href) return html`<a ${attrs}>${children}</a>`
  if (attrs.for) return html`<label ${attrs}>${children}</label>`
  return html`<button ${attrs}>${children}</button>`
}
