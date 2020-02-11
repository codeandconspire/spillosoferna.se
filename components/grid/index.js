var html = require('choo/html')

module.exports = grid
module.exports.cell = cell

// render children in grid cells
// (obj?, arr) -> Element
function grid (opts, children) {
  if (!children) {
    children = opts
    opts = {}
  }

  if (opts.ordered) return html`<ol class="Grid">${children.map(child)}</ol>`
  return html`<div class="Grid">${children.map(child)}</div>`

  // render grid cell
  // (Element|obj -> num) -> Element
  function child (props, index) {
    var attrs = { class: 'Grid-cell' }

    var children = props
    if (children.render) children = children.render
    if (typeof children === 'function') children = children()

    var size = props.size || opts.size
    if (size) attrs.class += ' ' + sizes(size)

    var appear = props.appear
    if (!appear && typeof appear !== 'number') {
      appear = opts.appear
    }
    if (appear || typeof appear === 'number') {
      const order = typeof appear === 'number' ? appear : index
      attrs.class += ' Grid-cell--appear'
      attrs.style = `animation-delay: ${order * 100}ms`
    }

    if (opts.ordered) return html`<li ${attrs}>${children}</li>`
    return html`<div ${attrs}>${children}</div>`
  }
}

// convenience function for creating grid cells with options
// (obj, Element|arr) -> obj
function cell (opts, children) {
  if (!children) {
    children = opts
    opts = {}
  }
  return Object.assign({ render: children }, opts)
}

function sizes (opts) {
  var size = ''
  if (opts.xs) size += `u-size${opts.xs} `
  if (opts.sm) size += `u-sm-size${opts.sm} `
  if (opts.md) size += `u-md-size${opts.md} `
  if (opts.lg) size += `u-lg-size${opts.lg} `
  if (opts.xl) size += `u-xl-size${opts.xl} `
  return size
}
