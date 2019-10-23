var html = require('choo/html')

exports.people = function people () {
  return html`
    <svg class="Symbols Symbols--people" width="16" height="14" viewBox="0 0 16 14">
      <g fill="currentColor" fill-rule="nonzero">
        <path d="M5.8 6.3a3 3 0 100-6 3 3 0 000 6zm0-4.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.8 7.8a2.2 2.2 0 100-4.5 2.2 2.2 0 000 4.5zm0-3a.7.7 0 110 1.4.7.7 0 010-1.5zM11.8 8.5c-.9 0-1.7.3-2.3.8a5.3 5.3 0 00-9 3.7.7.7 0 101.5 0 3.8 3.8 0 017.5 0 .7.7 0 101.5 0c0-.9-.2-1.7-.6-2.5a2.3 2.3 0 013.6 1.8.7.7 0 101.5 0c0-2.1-1.7-3.8-3.8-3.8z"/>
      </g>
    </svg>
  `
}
