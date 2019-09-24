var html = require('choo/html')
var asElement = require('prismic-element')
var view = require('../components/view')
var serialize = require('../components/text/serialize')
var {
  text,
  asText,
  loader,
  resolve,
  HTTPError
} = require('../components/base')

module.exports = view(thread, meta)

function thread (state, emit) {
  return state.prismic.getByUID('thread', state.params.uid, function (err, doc) {
    if (err) throw HTTPError(404, err)
    if (!doc) {
      return html`
        <main class="View-main">
          <div class="Text">
            <h1>${state.partial ? asText(state.partial.data.title) : loader(16)}</h1>
            ${state.partial ? asElement(state.partial.data.description, resolve) : html`<p>${loader(48)}</p>`}
          </div>
        </main>
      `
    }

    return html`
      <main class="View-main">
        <div class="Text">
          <h1>${asText(doc.data.title)}</h1>
          ${text`Årskurs ${doc.data.age}`}
          ${asElement(doc.data.description, resolve)}
          ${doc.data.goal.id && !doc.data.goal.isBroken ? html`
            <h2>${text`Tråden ${asText(doc.data.title)} är framtagen primärt för mål ${doc.data.goal.data.number}`}</h2>
            ${asElement(doc.data.goal.data.description)}
          ` : null}
          <h2>${text`Lektioner`}</h2>
        </div>
        ${doc.data.lessons.map(function (slice) {
          if (slice.slice_type !== 'lesson') return null
          return html`
            <details>
              <summary class="Text">
                ${slice.primary.label} • ${slice.primary.duration}
                <h2>${asText(slice.primary.name)}</h2>
              </summary>
              <div class="Text">
                ${asElement(slice.primary.description, resolve, serialize)}
                ${slice.primary.preparation.length ? html`
                  <h3>${text`Ha tillgängligt`}</h3>
                  ${asElement(slice.primary.preparation)}
                ` : null}
                ${slice.primary.resource.url ? html`
                  <h3>${text`Material`}</h3>
                  <a href="${slice.primary.resource.url}">${slice.primary.resource.name}</a>
                ` : null}
                <h3>${text`Gör så här`}</h3>
                <ol>
                ${slice.items.map((item, index) => html`
                  <li>
                    ${asElement(item.text, resolve, serialize)}
                    ${item.note.length ? html`
                      <h4>${text`Till dig som pedagog`}</h4>
                      ${asElement(item.note, resolve)}
                    ` : null}
                  </li>
                `)}
                </ol>
              </div>
            </details>
          `
        }).filter(Boolean)}
      </main>
    `
  })
}

function meta (state) {
  return state.prismic.getByUID('thread', state.params.uid, function (err, doc) {
    if (err) throw HTTPError(404, err)
    if (!doc) return null
    var props = {
      title: asText(doc.data.title),
      description: asText(doc.data.description)
    }

    return props
  })
}
