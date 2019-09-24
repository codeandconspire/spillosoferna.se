var html = require('choo/html')
var { text } = require('../base')

var DEBUG = process.env.NODE_ENV === 'development'
if (typeof window !== 'undefined') {
  try {
    const flag = window.localStorage.DEBUG
    DEBUG = DEBUG || (flag && JSON.parse(flag))
  } catch (err) {}
}

module.exports = error

function error (err, state, emit) {
  return html`
    <main class="View-main">
      <h1>${text`Hoppsan`}</h1>
      ${message(err.status)}
      ${DEBUG ? html`<div class="Text"><pre>${err.stack}</pre></div>` : null}
    </main>
  `
}

function message (status) {
  switch (status) {
    case 404: return html`<div><p>${text`Här fanns det visst ingen sida. Kanske kan du hitta vad du söker i menyn eller via ${html`<a href="/">${text`startsidan`}</a>`}.`}</p></div>`
    case 503: return html`<div><p>${text`Du verkar inte vara uppkopplad. Kontrollera att du har tillgång till internet och ${html`<a href="" onclick=${reload}>${text`prova igen`}</a>`}.`}</p></div>`
    default: return html`<div><p>${text`Något har visst gått galet. Det kan vara tillfälligt och fungera om du ${html`<a href="" onclick=${reload}>${text`försöker igen`}</a>`}.`}</p></div>`
  }

  function reload (event) {
    window.location.reload()
    event.preventDefault()
  }
}
