module.exports = navigation

function navigation (state, emitter) {
  state.partial = null
  state.prev = '/'

  emitter.prependListener('pushState', onnavigate)
  emitter.prependListener('replaceState', onnavigate)

  emitter.prependListener('pushState', function (href, opts = {}) {
    state.partial = opts.partial || null
  })

  function onnavigate (href, opts = {}) {
    state.prev = state.href === '' ? '/' : state.href
    if (!opts.persistScroll) {
      window.requestAnimationFrame(function () {
        window.scrollTo(0, 0)
      })
    }
  }
}
