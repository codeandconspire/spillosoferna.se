var html = require('choo/html')
var { img } = require('../base')

module.exports = gallery

function gallery (props) {
  if (!props.items) {
    return null
  }

  return html`
    <section class="Gallery">
      ${props.title ? html`
        <div class="Text">
          <h2>${props.title}</h2>
        </div>
      ` : null}
      <div class="Gallery-items">
        ${props.items.map((item) => item.image.url ? html`
          <figure class="Gallery-item">
            ${img(item.image, { class: 'Gallery-image', sizes: '20rem' }, {
              sizes: [400, 800, 1000, 1200]
            })}
          </figure>
        ` : null)}
      </div>
    </section>
  `
}
