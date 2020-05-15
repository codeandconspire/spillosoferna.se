var choo = require('choo')

var app = choo()

if (process.env.NODE_ENV === 'development') {
  app.use(require('choo-devtools')())
  app.use(require('choo-service-worker/clear')())
}

app.use(require('choo-meta')({
  origin: process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : process.env.HOST
}))
app.use(require('./stores/prismic')({
  middleware: require('./lib/prismic-middleware')
}))
app.use(require('./stores/user'))
app.use(require('./stores/navigation'))
app.use(require('choo-service-worker')('/sw.js'))

app.route('/', require('./views/home'))
app.route('/start', require('./views/start'))
app.route('/om', require('./views/about'))
app.route('/villkor', require('./views/terms'))
app.route('/start/om', require('./views/about'))
app.route('/start/:uid', require('./views/thread'))
app.route('/malen', require('./views/goals'))
app.route('/malen/:uid', require('./views/goal'))
app.route('/*', catchall)

try {
  module.exports = app.mount('body')
  // remove parse guard added in header
  window.onerror = null
} catch (err) {
  if (typeof window !== 'undefined') {
    document.documentElement.removeAttribute('scripting-enabled')
    document.documentElement.setAttribute('scripting-initial-only', '')
  }
}

// custom view matching
// (obj, fn) -> Element
function catchall (state, emit) {
  var view
  var segments = state.href.split('/').slice(1)

  if (segments.length < 3) {
    state.params.slug = segments[segments.length - 1]
    view = require('./views/page')
  } else {
    view = require('./views/404')
  }

  return view(state, emit)
}
