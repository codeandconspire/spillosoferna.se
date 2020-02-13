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
        <g fill="#E0AAC3" fill-rule="evenodd">
          <path d="M200 97c4-51 22-80 54-88 48-12 98-18 98 20 0 39-23 82-7 94 16 11 81-6 95-6s40 5 40 45-19 55 0 111c20 56 27 83-16 111-43 29-211 107-264 123-52 15-108 23-172-33-65-55 1-140 29-161 29-20 64-13 70 35 6 49 15 104 39 104s76-34 55-104c-21-69-133-66-148-82-16-16 11-60 44-52s112 86 190 99c79 13 113 9 100-40-13-48-46-97-100-86-53 11-82 25-100-6-12-20-14-48-7-84zM425 70c11 0 24-5 30-21 7-16-2-33-14-33-11 0-34 4-34 22s7 32 18 32z"/>
        </g>
      </svg>
      <svg class="Callout-abstract Callout-abstract--2" viewBox="0 0 496 518">
        <g fill="#E0AAC3" fill-rule="evenodd">
          <path d="M200 97c4-51 22-80 54-88 48-12 98-18 98 20 0 39-23 82-7 94 16 11 81-6 95-6s40 5 40 45-19 55 0 111c20 56 27 83-16 111-43 29-211 107-264 123-52 15-108 23-172-33-65-55 1-140 29-161 29-20 64-13 70 35 6 49 15 104 39 104s76-34 55-104c-21-69-133-66-148-82-16-16 11-60 44-52s112 86 190 99c79 13 113 9 100-40-13-48-46-97-100-86-53 11-82 25-100-6-12-20-14-48-7-84zM425 70c11 0 24-5 30-21 7-16-2-33-14-33-11 0-34 4-34 22s7 32 18 32z"/>
        </g>
      </svg>
      <svg class="Callout-art" viewBox="0 0 351 96">
        <g fill="none" fill-rule="evenodd">
          <path fill="#E0AAC3" d="M295 67h26V0h-26zM325 67h26V14h-26z"/>
          <path fill="#FFFFFE" d="M309 16h7V9h-7zM298 16h7V9h-7zM309 27h7v-7h-7zM298 27h7v-7h-7zM309 39h7v-7h-7zM298 39h7v-7h-7zM340 27h7v-7h-7zM329 27h7v-7h-7zM340 39h7v-7h-7zM329 39h7v-7h-7zM340 50h7v-7h-7zM329 50h7v-7h-7zM340 62h7v-7h-7zM329 62h7v-7h-7zM309 50h7v-7h-7zM298 50h7v-7h-7zM309 62h7v-7h-7zM298 62h7v-7h-7z"/>
          <path fill="#E2639A" d="M7 67h41V39H7z"/>
          <path fill="#1B5B61" d="M27.56 22L0 39h55z"/>
          <path fill="#FFFFFE" d="M36 58h7v-7h-7zM11 59h7v-7h-7zM22 67h10V51H22z"/>
          <path fill="#43AE64" d="M249 72.5a8.5 8.5 0 1017 0 8.5 8.5 0 00-17 0"/>
          <path fill="#43AE64" d="M243 80a7 7 0 1014 0 7 7 0 00-14 0"/>
          <path fill="#43AE64" d="M253 80a7 7 0 1014 0 7 7 0 00-14 0"/>
          <path fill="#43AE64" d="M254 96h4V83h-4zM261 52.02a7 7 0 1014-.04 7 7 0 00-14 .04"/>
          <path fill="#43AE64" d="M263 43.02a7 7 0 1014-.04 7 7 0 00-14 .04"/>
          <path fill="#43AE64" d="M269 50.03a9 9 0 1018-.06 9 9 0 00-18 .06"/>
          <path fill="#43AE64" d="M271.06 73L271 56.01l3.95-.01.05 16.99zM76 73.51l-3.57-8.47h1.98l-4.01-9.5h1.63L68 46l-4.02 9.54h1.63l-4.01 9.5h1.98L60 73.51h6.09V81h3.82v-7.49zM96 59.51l-3.57-8.47h1.98l-4.01-9.5h1.63L88 32l-4.02 9.54h1.63l-4.01 9.5h1.98L80 59.51h6.09V67h3.82v-7.49zM112 80.51l-3.57-8.47h1.98l-4.01-9.5h1.63L104 53l-4.02 9.54h1.63l-4.01 9.5h1.98L96 80.51h6.09V88h3.82v-7.49z"/>
        </g>
      </svg>
    </section>
  `
}
