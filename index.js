var choo = require('choo')

var app = choo()

if (process.env.NODE_ENV === 'development') {
  app.use(require('choo-devtools')())
}

app.use(require('choo-meta')({
  origin: process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : process.env.npm_package_now_alias
}))
app.use(require('./stores/prismic')({
  middleware: require('./lib/prismic-middleware')
}))
app.use(require('./stores/user'))
app.use(require('./stores/navigation'))

app.route('/', require('./views/home'))
app.route('/start', require('./views/start'))
app.route('/om', require('./views/about'))
app.route('/start/om', require('./views/about'))
app.route('/villkor', require('./views/terms'))
app.route('/start/:uid', require('./views/thread'))
app.route('/malen', require('./views/goals'))
app.route('/malen/:uid', require('./views/goal'))

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
