var html = require('choo/html')
var view = require('../components/view')
var Signin = require('../components/signin')
var serialize = require('../components/text/serialize')
var {
  src,
  asText,
  loader,
  resolve,
  HTTPError,
  asElement
} = require('../components/base')

module.exports = view(home, meta)

function home (state, emit) {
  return state.prismic.getSingle('landing', function (err, doc) {
    if (err) throw HTTPError(404, err)
    if (!doc) {
      return html`
        <main class="View-main">
          <div class="Text">
            <h1>${state.partial ? asText(state.partial.data.title) : loader(16)}</h1>
            ${state.partial ? asElement(state.partial.data.description, resolve, serialize) : html`<p>${loader(48)}</p>`}
          </div>
        </main>
      `
    }

    return html`
      <main class="View-main">
        <svg class="View-art" viewBox="0 0 369 587">
          <g fill="none" fill-rule="evenodd">
            <path fill="#195B60" d="M83.37 217.68c2.14-1.38 2.38-5.3 3.07-9.02-1.3-.6-2.11-1.9-1.65-4.14.56-2.69 2.75-5.68 4.53-5.31.87.18 1.54.87 1.95 1.83.62-.19 1.32-.3 2.12-.3 9.4 0 12.53-12.52 12.53-12.52h.02c.18-.41.41-.77.67-1.1 1.41-1.74 3.73-2.21 3.92-2.96.35-1.44-2.13-4.24-3.5-4.79-2.15-.85-6.95-.76-9.22-.37a46.6 46.6 0 00-9 2.78c-2.85 1.15-5.31 1.77-9.12 4.38-3.83 2.62-5.58 4.98-6.67 7.17-1.94 3.91-1.57 10.56 2.36 17.3 2.7 4.63 4.42 7.43 6.36 7.54.52.04 1.05-.11 1.63-.49"/>
            <path fill="#E0AAC3" d="M97.02 232.84c6.48-1.13 9.16-3.78 10.67-4.88l-4.77-7.26-.21.03c6.41-4.53 10.2-13.73 9.18-22.36-.57-4.7-2.5-8.49-5.28-11.24-.26.32-.5.68-.67 1.1l-.02-.01s-3.13 12.52-12.53 12.52c-.8 0-1.5.11-2.12.3-.4-.97-1.08-1.65-1.95-1.83-1.78-.37-3.97 2.62-4.53 5.31-.46 2.23.35 3.54 1.65 4.14-.69 3.72-.93 7.64-3.07 9.02-.58.38-1.12.53-1.63.5a19.68 19.68 0 008.08 4.8l-4.86 8.28c2.97.92 6.04 2.63 12.06 1.58"/>
            <path fill="#1B5B61" d="M333.45 368.73h.19l-4.62-9.95c4.51-2.18 8.37-6.32 10.72-11.26l-.61-.01c-.82-.04-.98-2.41-2.89-2.4-4.15.05-5.4-3.12-5.26-4.65.48-4.8-2.25-4.32-3.37-5.67-.72-.87-.56-3.59-2.77-3.05-1.85.44-2.32 3.76-4.78 3.44-3.56-.47-7.02-3.63-8.07-2.7-2.63 2.32-5.87 3.06-7.57 1.89l-.07-.06c-.05.31-.11.6-.15.92-1.1 9.22 3.31 19.1 10.55 23.22l-5.04 10.3c2.14.68 4.96 3.2 11.32 3.1 7.48-.14 11.66-3.14 12.42-3.12"/>
            <path fill="#FAF291" d="M286.8 231.3l-1.8-5.67c-2.34.55-4.32.86-5.2.87-.36 0 3.74-28.35 3.74-28.35L264 192.37a21.12 21.12 0 00-1.5 4.13c-2.03 8.16.35 17.42 5.76 22.8l-5.61 8.58.05.26c1.48.97 4.08 3.85 10.92 5.05 6.77 1.18 9.82-1.14 13.19-1.89M58.56 368.38l-5-9.52c6.7-4.4 10.71-13.84 9.65-22.67-.74-6.2-3.82-10.8-8.15-13.54 1.37 1.51.34 4.67-.67 6.45-1.02 1.79-2.77 3.03-4.54 4.09-1.76 1.06-3.62 2.04-5.06 3.51-2.91 2.99-3.6 7.46-5.65 11.1a16.18 16.18 0 01-5.63 5.8c-.61.38-1.33.7-2.03.73 2 2.3 4.36 4.19 6.94 5.43l-6.5 8.93c2.95.49 6.44 3.6 13.46 3.63 8.07.04 12.58-3.94 13.18-3.94"/>
            <path fill="#1B5B61" d="M196.54 73.21l-4.8-9.07c4.45-2.95 7.73-8.28 8.74-14.03 1.06-.08 2.1-.73 2.95-2.23 1.42-2.48 1.78-6.33.14-7.27-1-.57-2.33-.32-3.53.53l.01.02s-7.18-4.37-15.84-4.47c-9.55.36-15.86 4.36-15.88 4.38l-.02.05c-1.2-.83-2.5-1.08-3.5-.5-1.65.93-1.29 4.78.13 7.26.85 1.48 1.88 2.13 2.92 2.23 1.04 5.88 4.45 11.33 9.06 14.24l-4.69 8.27c3.34.74 7.67 3.6 11.8 3.69 4.74.1 9.26-2.43 12.51-3.1"/>
            <path fill="#445D9A" d="M20.73 442.04h-.12c-.03 1.48-2.9 3.51-2.84 11.74.03 3.62 3.55 9.79 3.4 13.18-.82 17.67-.54 41.3-.54 41.3L1.26 568.73l11.8.11s30.57-50.84 33-58.07c1.72-5.13 4.33-44.32 4.33-44.32s.26-.66.64-.66c.4.01.7.62.7.62l16 40.84 9.57 61.59 11.87-.02s3.3-52.4 2.17-66.65c-.84-10.6-18.06-57.95-18.72-59.76l-51.86-.13-.03-.25M187.33 413.1c-.85-1.96-1.56-6.5.7-8.69 4.53-4.36 9.56-1.33 9.56-1.33l2.82 1.6.83-18.26c-3.83-.6-7.39-4.8-7.68-14.3h-.03v1.1h-13.66v-.44c-1.29 10.39-5.53 13.72-9.57 13.46l1.02 16.9.08-.06s5.04-3.03 9.55 1.33c2.28 2.2 1.56 6.73.7 8.7-2.69 6.22-21.72 14.92-21.72 14.92s-7.02 3.56-12.37 5.05c1.8-.39 3.92-1.1 5.95-1.9l-.34 5.3-.22 5.92 62.5.03-.46-4.33-.51-7.57c-3.04-1.3-5.42-2.5-5.42-2.5s-19.03-8.7-21.73-14.92M213.24 411.95l-3.49-1.97 3.49 1.98z"/>
            <path fill="#E0AAC3" d="M152.95 442.42s-1.71 5.5-1.83 16.72c-.2 19.07 3.61 60.39 3.61 60.39l3.87 49.32 14.7-.05 3.62-48.54 5.53-52.13s.33-2.02 1.6-2.14c1.71-.17 2.05 2.23 2.05 2.23l4.41 50.84 4.16 49.8H208l3.61-48.98s4.38-39.45 5.89-57.04c.4-4.8-2.07-20.4-2.07-20.4l-62.48-.02z"/>
            <path fill="#43AE64" d="M368.91 568.84l-22.8-60.34s-1.53-30.89-2.35-48.56c-.16-3.4 3.26-8.57 2.1-15.86h-.05l.02.15-51.8-.4h-.01s-17.75 47.78-18.61 58.6c-1.13 14.24-.92 66.4-.92 66.4l14.5.01 9.93-61.94 16.1-40.23s.3-.61.7-.62c.39 0 .64.66.64.66s4.55 38.35 6.27 43.48c2.43 7.23 28.07 58.65 28.07 58.65h18.21z"/>
            <path fill="#445D9A" d="M135.28 220.3l6.8-2.44c14.83-23.54 39.86-62.51 42.96-62.6 3.81-.1 20.65 35 32.23 58.94l1.1.35 16.99 6.1-.02.04 5.51 1.98c-4.9-16.48-13.35-41.38-13.35-41.38l-18.06-47.58h.05v-5.17H159.1v5.17h.07L141.1 176.5l-20.25 49.03 14.45-5.19-.02-.04zM166.16 406.06l-8.66 4.9-6.07-31.97c-1.54 3.8-3.9 9.73-6.04 15.63l8.38 18.47 12.39-7.03zM143.42 400.3"/>
            <path fill="#43AE64" d="M131.08 293.63l.02.03-5.41-47 23.86-12.2 24.8-10.42s4.71-2.05 6.19-2.91a12.7 12.7 0 003.71-3.14 12.78 12.78 0 01-3.66 3.07c-1.48.86-6.18 2.91-6.18 2.91L149.6 234.4l-6.43 3.29-7.87-17.35-14.45 5.19-2.9 1.04c-.01 0-9.66 1-9.9 1.15l-.36.24c-1.51 1.1-4.2 3.75-10.67 4.88-6.02 1.05-9.09-.66-12.06-1.58a12.6 12.6 0 00-1.7-.42c-.37-.06-7.84 1.32-7.84 1.32l-17.38-8.8-8.68 15.49 22.3 15.81 7.11 45.98h.02l-.01-.06 52.3-6.95z"/>
            <path fill="#E0AAC3" d="M185.39 211.36c-.13-.38-.27-.76-.46-1.15-2.86-6.1-8.54-4.27-11.5-3.04-3 1.24-21.15 7.03-21.15 7.03l-10.2 3.66-6.8 2.44.02.04 7.87 17.35 6.43-3.29 24.8-10.43s4.71-2.05 6.19-2.9c1.1-.64 2.56-1.66 3.66-3.09.4-.5.74-1.08 1-1.7a6.99 6.99 0 01.14-4.92M58.04 223.35l-9.7-6.37-25.08-15.23s-4.92-1.92-8.97 3.59c-4.72 6.42 5.73 12 5.73 12l29.34 21.5v.01l8.68-15.5z"/>
            <path fill="#E2639A" d="M227.47 238.04l-6.43-3.29-24.81-10.43s-4.7-2.05-6.18-2.9a12.77 12.77 0 01-3.66-3.09c1.1 1.46 2.6 2.5 3.71 3.15 1.48.86 6.18 2.9 6.18 2.9l24.81 10.44 23.86 12.2-5.42 47.01.06.01.03-.04 52.24 7.44v.03h.01l7.11-46.46 22.3-15.81-8.68-15.5-17.38 8.81s-7.47-1.38-7.84-1.32l-.57.11c-3.37.75-6.42 3.07-13.19 1.89-6.84-1.2-9.44-4.08-10.92-5.05l-.11-.07c-.24-.15-9.9-1.15-9.9-1.15l-11.84-4.25-5.51-1.98-7.87 17.35z"/>
            <path fill="#FAF291" d="M185.7 210.56c-.12.27-.22.53-.31.8a6.99 6.99 0 001 6.97 12.75 12.75 0 003.66 3.08c1.48.86 6.18 2.91 6.18 2.91l24.8 10.43 6.44 3.29 7.87-17.35.02-.04-17-6.1-1.09-.35c-3.96-1.27-17.5-5.63-20.05-6.68-2.97-1.23-8.65-3.06-11.51 3.04M350.62 217.7s10.44-5.6 5.73-12.02c-4.05-5.5-8.97-3.59-8.97-3.59l-25.08 15.24-9.77 6.17 8.85 15.56 29.24-21.37z"/>
            <path fill="#2A968B" d="M25.08 395.85l23.74.47 3.82 15.52 12.27 4.48-2.44-.95 6.72-37-.08-1.39s-1.57-8.05-7.4-8.43c-1.97-.12-1.64-.18-3.15-.17-.6 0-5.1 3.97-13.18 3.94-7.02-.02-10.5-3.14-13.46-3.63a4.16 4.16 0 00-1.23-.03c-3.5.46-5.34 1.55-7.83 4.03-2.15 2.14-3.76 17.09-3.76 17.09s-1.61 24.5 1.63 52.26l.03.25 51.86.13h.02l-.3-5.67c-13.08-3.12-31.95-11.45-31.95-11.45l-15.31-29.45z"/>
            <path fill="#FAF291" d="M345.8 444.08c-2.26-16.88-.12-59.06-.12-59.06s.37-9.95-1.78-12.08c-3.3-3.28-3.94-4.04-10.26-4.2l-.19-.02c-.76-.01-4.94 3-12.42 3.13-6.36.1-9.18-2.42-11.32-3.1-.32-.1-.63-.15-.93-.15-3.48-.03-1 .02-3.75.2a6.63 6.63 0 00-4.85 2.78l7.56 42.2-6.08 2.23 14.36-5.24 3.82-15.52 23.74-.47-15.32 29.45s-20.77 9.17-33.82 11.87l-.42 7.73h.02l51.79.4-.02-.15M159.93 428.03s19.03-8.7 21.73-14.92c.85-1.97 1.57-6.5-.7-8.7-4.52-4.36-9.56-1.33-9.56-1.33l-.08.05v.01l-5.16 2.92-12.38 7.03-8.38-18.48-.16.43-1.82 5.26a369.55 369.55 0 00-4.62 13.82c-1.4 4.73-2.8 15.86 3.51 19.31 1 .55 2.98.29 5.25-.35 5.35-1.5 12.37-5.05 12.37-5.05M216.6 410.07l-1.38 3.02h-.01l-.01.01-1.55-.9-.41-.24-3.5-1.98-9.33-5.27v-.02l-2.82-1.6s-5.03-3.04-9.55 1.33c-2.27 2.19-1.56 6.72-.7 8.69 2.7 6.22 21.72 14.92 21.72 14.92s2.38 1.2 5.42 2.5c4.41 1.9 10.22 3.99 12.2 2.9 6.32-3.45 4.91-14.58 3.51-19.31-1.32-4.5-3.92-12.2-6.47-19.61l-.05.1.03.08-7.1 15.38z"/>
            <path fill="#E2639A" d="M157.5 410.96l8.66-4.9 5.16-2.92-1.02-16.9c-2.53-.17-4.98-1.73-6.58-3.83-3.86-5.05-2.28-26.12-2.28-33.3 0-6.7 2.02-12.85 5.41-17.74l-35.75-37.71-.02-.03-52.3 6.95v.05l.06.44-.85 9.98-4.53 43.78-4.27 23.55-6.72 37 2.44.94 12.53 4.57s.67.33 1.65.89a85.6 85.6 0 001.9-5.96l16.35-43.4 9-47.26s.52-3.38 3.84-3.55c1.02-.05 3.72 1.67 3.72 1.67l32.12 27.15 5.41 28.56 6.07 31.97z"/>
            <path fill="#FAF291" d="M64.91 416.32l-12.27-4.48-3.82-15.52-23.74-.47 15.31 29.45s18.87 8.33 31.94 11.45c4.86 1.16 8.92 1.6 10.91.64 2.6-1.27 4.18-6.29 3.02-9-1.22-2.85-4.98-5.34-7.17-6.61-.98-.56-1.65-.89-1.65-.89l-12.53-4.57z"/>
            <path fill="#1B5B61" d="M343.58 394.78l-23.74.47-3.82 15.52-14.36 5.24-10.49 3.83c-.4.2-7.06 3.49-8.78 7.48-1.16 2.7.43 7.73 3.03 9 1.72.84 5.01.61 9.02-.22 13.05-2.7 33.82-11.87 33.82-11.87l15.32-29.45z"/>
            <path fill="#445D9A" d="M213.56 412.14v.01l.09.05 1.55.9.01-.02 1.4-3.01 7.09-15.38-.03-.08-4.8-12.25-4.72 30.11z"/>
            <path fill="#2A968B" d="M301.66 416l6.09-2.22-7.57-42.2-2.94-16.38-4.53-43.77-.85-9.96v-.03L239.62 294l-.03.04-33.74 35.6a30.87 30.87 0 016.7 19.46c0 8.57-4.4 15.1-2.25 22.23 2.76 9.15-3.44 15.98-9.06 15.1l-.83 18.26v.02l9.34 5.27 3.49 1.97.32.19.59.33 4.7-30.11 5.12-32.62 32.83-26.09s2.7-1.72 3.72-1.66c3.32.16 3.83 3.55 3.83 3.55l11.72 45.14 13.64 45.51 1.36 3.68s.05 0 .1-.03l10.5-3.83"/>
            <path fill="#FAF291" d="M209.57 98.28c.98-2.55 9.78-17.77 19.6-34.45-1.58-1.3-6.69-5.18-11.29-9.88-.02 0 .08-.2.3-.56-6.67 9.96-13.92 19.22-18.06 19.55-.56.04-1.37.08-2.36.11a7.2 7.2 0 00-1.22.16c-3.25.66-7.77 3.2-12.52 3.1-4.12-.1-8.45-2.95-11.79-3.7a7.6 7.6 0 00-.92-.15c-2.58-.24-4.53-.56-5.36-.97-2.9-1.43-8.64-8.45-14.5-16.41-.87.54-12.35 8.65-12.51 8.78 10.46 17.17 19.86 33.28 19.89 35.75.14 15.24.26 27.5.3 28.9l14.02.03h36.3c-.07-1.66-1.06-27.2.12-30.26"/>
            <path fill="#E2639A" d="M258.13 8.43a3.6 3.6 0 01-.05-.07 5.04 5.04 0 00.05.07M109.8 16.11a9.02 9.02 0 001.25 3.05l3.37 5.3-3.31-5.4s-.91-1.3-1.32-2.95"/>
            <path fill="#1B5B61" d="M151.5 55.05c-4.2-5.36-13.8-20.17-15.95-23.22-5.2-7.4-15.31-22.13-15.31-22.13s-2.92-3.67-9.13 1.69c-1.62 1.4-1.68 3.2-1.32 4.72a9.66 9.66 0 001.32 2.94l3.31 5.42c5.4 8.8 16.3 26.55 24.51 39.4a1034.86 1034.86 0 0112.57-8.82M229.17 63.83l.09.08c11.68-18.03 28.37-47.84 28.37-47.84s2.59-4.35.84-7.17a3.6 3.6 0 00-.34-.47 7.4 7.4 0 00-.64-.64c-2.57-2.34-7.33-3.73-10.2-.44-5.9 6.74-14.14 21.31-14.14 21.31S220.28 49.7 218.17 53.4c-.2.37-.31.57-.29.56 4.6 4.7 9.7 8.57 11.29 9.88"/>
            <path fill="#E0AAC3" d="M187 320.26c-8.19 0-15.47 4.35-20.15 11.1a31.13 31.13 0 00-5.4 17.74c0 7.2-1.59 28.26 2.27 33.3 1.6 2.11 4.05 3.67 6.58 3.84 4.04.26 8.28-3.07 9.57-13.46v-7.11a17.52 17.52 0 01-6.18-10.63c-.83-.08-1.66-.6-2.33-1.78-1.14-2-1.43-5.07-.11-5.82.8-.46 1.85-.26 2.8.4l.02-.05v.03s11.95-2.76 12.69-8.78h.02c.74 5.89 12.2 8.65 12.67 8.76l.02.06c.96-.68 2.02-.89 2.83-.42 1.31.75 1.02 3.83-.11 5.82-.69 1.2-1.52 1.72-2.37 1.79a17.47 17.47 0 01-6.3 10.71v3.64c.02.17.03.34.03.52-.02.77-.01 1.5.01 2.2.3 9.5 3.85 13.7 7.68 14.3 5.62.9 11.82-5.94 9.06-15.1-2.15-7.13 2.26-13.65 2.26-22.22 0-7.5-2.55-14.34-6.7-19.47-4.68-5.76-11.4-9.37-18.86-9.37"/>
            <path fill="#FAF291" d="M193.53 365.76a17.48 17.48 0 006.3-10.71c.84-.07 1.67-.6 2.36-1.79 1.13-2 1.42-5.07.1-5.82-.8-.47-1.86-.26-2.82.42l-.02-.06c-.48-.1-11.94-2.87-12.67-8.76h-.02c-.74 6.02-12.7 8.78-12.7 8.78l.01-.03-.02.05c-.95-.66-2-.86-2.8-.4-1.32.75-1.03 3.83.1 5.82.68 1.18 1.51 1.7 2.34 1.78a17.51 17.51 0 006.18 10.63v7.55h13.66V365.76z"/>
            <path fill="#195B60" d="M39.14 347.8c2.06-3.64 2.74-8.11 5.65-11.1 1.44-1.47 3.3-2.45 5.06-3.51 1.77-1.06 3.52-2.3 4.54-4.1 1.01-1.77 2.04-4.93.67-6.44l-.03-.03-1.13-.72a14.19 14.19 0 00-7.3-2.3c-4.17-.04-8.5-.04-12.29 1.7-.78.35-1.52.78-2.22 1.26a9.77 9.77 0 01-7.15 11.94l-.15 1.17c-.57 6 1.43 12.01 4.56 17.16.3.5.65 1.03 1.18 1.3.3.16.62.2.95.2a4.4 4.4 0 002.03-.72 16.16 16.16 0 005.63-5.82"/>
            <path fill="#195B60" d="M32.34 323.85a9.77 9.77 0 10-19.43 2.31 9.77 9.77 0 0019.43-2.31"/>
            <path fill="#E0AAC3" d="M312 332.48c1.04-.93 4.5 2.23 8.06 2.7 2.46.32 2.93-3 4.78-3.44 2.21-.54 2.05 2.18 2.77 3.05 1.12 1.35 3.85.87 3.37 5.67-.15 1.53 1.1 4.7 5.26 4.66 1.91-.02 2.07 2.35 2.89 2.39h.6c8.27.1 5.18-5.72 6.53-6.96 5.25-4.85-2.09-7.84-2.09-7.84s1.43-4.65-3.31-5c-.62-.05 1.93-5-4.6-6.03-1.9-.3.14-4.83-7.24-3.92-1.15.14-3.11-4.42-9.76-2.11 0 0-1.6.8-4.3-.17-4.06-1.47-5.52 4.68-5.52 4.68s-5.91.07-5.41 6.97c0 0-3 4.8.32 7.18l.07.06c1.7 1.17 4.94.43 7.57-1.9"/>
            <path fill="#445D9A" d="M279.8 226.5c.88 0 2.86-.32 5.2-.87 4.63-1.07 10.67-3.04 12.3-5.26 2.27-3.1 3.54-11.02 4.04-14.83.44-3.34.29-9.19-.7-12.4-.84-2.79-4.66-7.37-7.13-8.89a32.22 32.22 0 00-8.72-3.2c-1.82-.3-5.48-.83-7.32-.74-1.72.09-4.89.81-6.42 1.4-1.98.75-4.87 3.28-6.18 4.85a67.82 67.82 0 00-3.28 5.1l2.42.71 19.53 5.78s-4.1 28.35-3.73 28.35"/>
            <path fill="#E0AAC3" d="M200.05 41.16v-.02a14.6 14.6 0 00-3.72-6.28l-5.35-1.51-6.8-3.07-12.39 4.79-.07.03c-2.66 2.84-3.4 5.97-3.4 5.97.03-.02 6.34-4.02 15.89-4.38 8.66.1 15.84 4.47 15.84 4.47"/>
            <path fill="#E0AAC3" d="M184.18 30.28l6.8 3.07 5.35 1.5 1.05.3c3.51.52 4.88-.88 5.62-2.27 1.22-2.3-.28-3.66-.35-4.07 0-.03 3.3.27 3.82-2.16.41-1.97-.5-2.97-1.35-4.02-.15-.18-.46-.41-.42-.47.03-.06.57-.24 1.1-.4 1.76-.55 2.73-2.88 1.94-4.32-.8-1.43-2.73-2.26-4.61-2.3.4-1.3-.55-3.4-1.98-3.99-1.42-.6-2.47-.78-4.8.3.57-2.44 1.73-6.26-2.83-8.84-2.1-1.19-7.94-2.05-9.45 1.1-.6-1.55-2.4-2.74-4.36-2.85-1.95-.12-3.92.85-4.78 2.32-5.28-.82-4.85 3.57-4.68 3.92.02.04-4.06.64-5.14 2.03-1.2 1.55-.87 3.56-.56 5.38.03.16.05.35-.08.47-.1.1-.26.12-.41.14-1.3.17-2.74.23-3.73.96-.94.69-1.25 1.8-1.27 2.85a7.93 7.93 0 002.76 6.04c.2.18.44.4.35.64-.05.14-.2.23-.32.33-1.18.93-.86 2.67.23 3.68 1.09 1 2.7 1.47 4.25 1.89 0 0-1.53 1.38-.85 2.49 1.82 2.96 5.68 1.36 6.23 1.1l.08-.03 12.4-4.8z"/>
            <path fill="#FFFFFE" d="M327.76 585.92h38.01l.05-13.15c-7.92 4.32-14.2-1.4-14.2-1.4l-11.74 2.94c-6.68 1.5-12.12 2.49-12.12 11.6v.01z"/>
            <path fill="#1B5B61" d="M348.45 575.95c-.32 0-.64-.1-.92-.32l-3.11-2.43a1.5 1.5 0 011.84-2.36l3.12 2.42a1.5 1.5 0 01-.93 2.69M344.24 577.67c-.33 0-.65-.1-.92-.31l-3.12-2.43a1.5 1.5 0 111.84-2.37l3.12 2.43a1.5 1.5 0 01-.92 2.68"/>
            <path fill="#FFFFFE" d="M250.37 586.01h38.01l.05-13.15c-7.92 4.32-14.2-1.4-14.2-1.4l-11.74 2.94c-6.68 1.5-12.12 2.49-12.12 11.61z"/>
            <path fill="#1B5B61" d="M271.06 576.04c-.32 0-.65-.1-.92-.32l-3.12-2.42a1.5 1.5 0 011.85-2.37l3.11 2.42a1.5 1.5 0 01-.92 2.69M266.84 577.76c-.32 0-.64-.1-.92-.31l-3.11-2.43a1.5 1.5 0 011.84-2.37l3.12 2.43a1.5 1.5 0 01-.93 2.68"/>
            <path fill="#FFFFFE" d="M115.24 585.98H77.23l-.05-13.16c7.92 4.32 14.2-1.4 14.2-1.4l11.74 2.95c6.68 1.49 12.12 2.48 12.12 11.6z"/>
            <path fill="#1B5B61" d="M94.55 576a1.5 1.5 0 01-.93-2.68l3.12-2.43a1.5 1.5 0 011.84 2.37l-3.11 2.43c-.28.2-.6.31-.92.31M98.76 577.73a1.5 1.5 0 01-.92-2.69l3.12-2.42a1.5 1.5 0 111.84 2.36l-3.12 2.43c-.27.21-.6.32-.92.32"/>
            <path fill="#FFFFFE" d="M38.53 585.97H.52l-.05-13.15c7.92 4.31 14.2-1.4 14.2-1.4l11.74 2.94c6.68 1.49 12.12 2.49 12.12 11.6z"/>
            <path fill="#1B5B61" d="M.45 583.83h37.97s-.07-.81-.33-1.83H.45v1.83zM17.84 576a1.5 1.5 0 01-.92-2.69l3.11-2.43a1.5 1.5 0 011.85 2.37l-3.12 2.43c-.27.21-.6.31-.92.31M22.06 577.72a1.5 1.5 0 01-.93-2.69l3.12-2.42a1.5 1.5 0 011.84 2.36l-3.11 2.43c-.28.21-.6.32-.92.32"/>
            <path fill="#FFFFFE" d="M155.93 586.03s20.76.02 20.76 0c-.14-6.26-1.03-11.42-10.38-11.34-9.06.07-10.2 4.43-10.38 11.34"/>
            <path fill="#1B5B61" d="M156.02 584l20.58-.02s-.06-.98-.18-1.83l-20.2.01c-.12.67-.2 1.83-.2 1.83"/>
            <path fill="#FFFFFE" d="M190.9 585.99h20.77c-.14-6.27-1.03-11.42-10.38-11.35-9.06.08-10.2 4.44-10.38 11.35"/>
            <path fill="#1B5B61" d="M191 583.94h20.58s-.08-1.22-.18-1.83h-20.21c-.11.76-.2 1.83-.2 1.83M77.22 583.82h37.96s-.07-.81-.32-1.83H77.22v1.83zM288.45 583.82H250.5s.07-.82.32-1.84h37.64v1.84zM365.84 583.76h-37.96s.07-.81.32-1.83h37.64v1.83z"/>
          </g>
        </svg>

        <div class="u-container">
          <div class="View-landing">
            <div class="View-info">
              <div class="Text">
                <h1>${asText(doc.data.title)}</h1>
                ${asElement(doc.data.description, resolve, serialize)}
                ${!doc.data.cta.isBroken && doc.data.cta.id ? html`
                  <p>
                    <a href="${resolve(doc.data.cta)}">${doc.data.cta_text || asText(doc.data.cta.data.title)}</a>
                  </p>
                ` : null}
              </div>
            </div>
            <div class="View-login">
              ${state.cache(Signin, 'landing-form').render()}
            </div>
          </div>
        </div>
      </main>
    `
  })
}

function meta (state) {
  return state.prismic.getSingle('landing', function (err, doc) {
    if (err) throw HTTPError(404, err)
    if (!doc) return null
    var props = {
      title: asText(doc.data.title),
      description: asText(doc.data.description)
    }

    var image = doc.data.featured_image
    if (image.url) {
      Object.assign(props, {
        'og:image': src(image.url, 1200),
        'og:image:width': 1200,
        'og:image:height': 1200 * image.dimensions.height / image.dimensions.width
      })
    }

    return props
  })
}
