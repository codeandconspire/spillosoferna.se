var html = require('choo/html')

module.exports = callout

function callout (props) {
  return html`
    <section class="Callout">
      <div class="Callout-container u-container">
        <div class="Text Text--center">
          ${props.title ? html`<h1>${props.title}</h1>` : null}
          ${props.body ? props.body : null}
        </div>
        ${props.link && props.linkText ? html`
          <a class="Callout-button" href="${props.link}">${props.linkText}</a>
        ` : null}
      </div>
      <svg class="Callout-abstract" viewBox="0 0 496 518">
        <g fill="#23A098" fill-rule="evenodd">
          <path d="M200 97c4-51 22-80 54-88 48-12 98-18 98 20 0 39-23 82-7 94 16 11 81-6 95-6s40 5 40 45-19 55 0 111c20 56 27 83-16 111-43 29-211 107-264 123-52 15-108 23-172-33-65-55 1-140 29-161 29-20 64-13 70 35 6 49 15 104 39 104s76-34 55-104c-21-69-133-66-148-82-16-16 11-60 44-52s112 86 190 99c79 13 113 9 100-40-13-48-46-97-100-86-53 11-82 25-100-6-12-20-14-48-7-84zM425 70c11 0 24-5 30-21 7-16-2-33-14-33-11 0-34 4-34 22s7 32 18 32z"/>
        </g>
      </svg>
      <svg class="Callout-abstract Callout-abstract--2" viewBox="0 0 496 518">
        <g fill="#23A098" fill-rule="evenodd">
          <path d="M200 97c4-51 22-80 54-88 48-12 98-18 98 20 0 39-23 82-7 94 16 11 81-6 95-6s40 5 40 45-19 55 0 111c20 56 27 83-16 111-43 29-211 107-264 123-52 15-108 23-172-33-65-55 1-140 29-161 29-20 64-13 70 35 6 49 15 104 39 104s76-34 55-104c-21-69-133-66-148-82-16-16 11-60 44-52s112 86 190 99c79 13 113 9 100-40-13-48-46-97-100-86-53 11-82 25-100-6-12-20-14-48-7-84zM425 70c11 0 24-5 30-21 7-16-2-33-14-33-11 0-34 4-34 22s7 32 18 32z"/>
        </g>
      </svg>
    </section>
  `
}
