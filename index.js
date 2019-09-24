var choo = require('choo')
var lazy = require('choo-lazy-view')

var app = choo()

if (process.env.NODE_ENV === 'development') {
  app.use(require('choo-devtools')())
  app.use(require('choo-service-worker/clear')())
}

app.use(lazy)
app.use(require('choo-meta')({
  origin: process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : process.env.npm_package_now_alias
}))
app.use(require('./stores/prismic')({
  middleware: require('./lib/prismic-middleware')
}))
app.use(require('./stores/navigation'))
app.use(require('choo-service-worker')('/sw.js'))

app.route('/', lazy(() => import('./views/home')))
app.route('/start', lazy(() => import('./views/start')))
app.route('/start/:uid', lazy(() => import('./views/thread')))

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
