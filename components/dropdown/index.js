var html = require('choo/html')

module.exports = dropdown

function dropdown (heading, chidren) {
  return html`
    <details class="Dropdown">
      <summary class="Dropdown-heading">${heading}</summary>
      <div class="Dropdown-content">
        ${chidren}
      </div>
    </details>
  `
}
