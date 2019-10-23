var html = require('choo/html')

exports.heading = heading

function heading (props) {
  return html`
    <div class="Goal Goal--${props.number} Goal--heading">
      <span class="Goal-number">${props.number}</span> ${props.title}
    </div>
  `
}
