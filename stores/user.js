module.exports = user

function user (state, emitter) {
  state.user = state.user || null

  emitter.on('DOMContentLoaded', function () {
    if (state.href.indexOf('/start') === -1) return
    window.fetch('/konto', {
      cache: 'no-store',
      headers: {
        Accept: 'application/json'
      }
    }).then(function (res) {
      if (!res.ok) throw new Error(res.status)
      return res.json()
    }).then(function (user) {
      state.user = user
      emitter.emit('render')
    }).catch(function () {
      window.location.assign('/')
    })
  })

  emitter.on('user:signout', function () {
    state.user = null
    window.fetch('/logga-ut', {
      cache: 'no-store',
      method: 'POST',
      headers: {
        Accept: 'application/json'
      }
    }).then(function (res) {
      window.location.assign('/')
    }).catch(function () {
      window.location.assign('/logga-ut')
    })
  })
}
