var fs = require('fs')
var path = require('path')
var html = require('choo/html')
var lang = require('./lang')

exports.resolve = resolve
exports.text = text
exports.asText = asText
exports.img = img
exports.src = src
exports.srcset = srcset
exports.HTTPError = HTTPError
exports.loader = loader
exports.truncate = truncate

/**
 * Resolve prismic document href
 * @param {Object} doc Prismic document or document link
 */
function resolve (doc) {
  switch (doc.type) {
    case 'user':
    case 'website':
    case 'landing': return '/'
    case 'about': return '/om'
    case 'start': return '/start'
    case 'thread': return `/start/${doc.uid}`
    case 'goals': return '/malen'
    case 'goal': return `/malen/${doc.uid}`
    case 'Web':
    case 'Media': return doc.url
    default: {
      // handle links to web and media
      const type = doc.link_type
      if (type === 'Web' || type === 'Media' || type === 'Any') return doc.url
      throw new Error(`Could not resolve href for document type "${doc.type}"`)
    }
  }
}

/**
 * Get text by applying as tagged template literal i.e. text`Hello ${str}`
 * @param {Array|String} strings String partial(s)
 * @param  {...any} parts Interpolated values
 */
function text (strings, ...parts) {
  parts = parts || []

  var key = Array.isArray(strings) ? strings.join('%s') : strings
  var value = lang[key]

  if (!value) {
    value = lang[key] = key
    if (typeof window === 'undefined') {
      const file = path.join(__dirname, 'lang.json')
      fs.writeFileSync(file, JSON.stringify(lang, null, 2))
    }
  }

  var hasForeignPart = false
  var res = value.split('%s').reduce(function (result, str, index) {
    var part = parts[index] || ''
    if (!hasForeignPart) {
      hasForeignPart = (typeof part !== 'string' && typeof part !== 'number')
    }
    result.push(str, part)
    return result
  }, [])

  return hasForeignPart ? res : res.join('')
}

/**
 * Nullable text getter for Prismic text fields
 * @param {Array} richtext Prismic rich text block
 */
function asText (richtext) {
  if (!richtext || !richtext.length) return null
  var text = ''
  for (let i = 0, len = richtext.length; i < len; i++) {
    text += (i > 0 ? ' ' : '') + richtext[i].text
  }
  return text
}

/**
 * Render Prismic image element
 * @param {Object} image Prismic image block
 * @param {Object} opts Image options
 * @param {Object} attrs Element attributes
 */
function img (image, attrs, opts = {}) {
  if (!image) return null
  attrs = {
    alt: image.alt || '',
    srcset: Array.isArray(opts.sizes)
      ? srcset(image.url, opts.sizes, opts)
      : null,
    ...image.dimensions,
    ...attrs
  }

  var [size, override] = Array.isArray(opts.sizes)
    ? Array.isArray(opts.sizes[0]) ? opts.sizes[0] : [opts.sizes[0]]
    : [image.dimensions.width]
  return html`<img ${attrs} src="${src(image.url, size, { ...opts, ...override })}">`
}

var AUTO_TRANSFORM = /\?(?:.+)?auto=([^&]+)/
var COMPRESS = /compress,?/

/**
 * Compose src attribute from url for a given size
 * @param {String} uri Image URI
 * @param {Number} size Image width
 * @param {Object} opts Image manipulations
 */
function src (uri, size, opts = {}) {
  var { transforms = 'c_fill,f_jpg', type = 'fetch' } = opts

  // apply default transforms
  if (!/c_/.test(transforms)) transforms += ',c_fill'
  if (!/f_/.test(transforms)) transforms += ',f_jpg'

  // trim prismic domain from uri
  if (transforms.includes('q_') && AUTO_TRANSFORM.test(uri)) {
    uri = uri.replace(AUTO_TRANSFORM, (match) => match.replace(COMPRESS, ''))
  }

  return `/media/${type}/${transforms ? transforms + ',' : ''}w_${size}/${uri}`
}

/**
 * Compose srcset attribute from url for given sizes
 * @param {String} uri Image URI
 * @param {Array<Number|Array>} sizes List of sizes and/or options
 * @param {Object} opts Image manipulations
 */
function srcset (uri, sizes, opts = {}) {
  if (AUTO_TRANSFORM.test(uri)) {
    uri = uri.replace(AUTO_TRANSFORM, (match) => match.replace(COMPRESS, ''))
  }

  return sizes.map(function (size) {
    opts = Object.assign({}, opts)
    if (Array.isArray(size)) {
      opts.transforms = opts.transforms ? size[1] + ',' + opts.transforms : size[1]
      size = size[0]
    }
    if (opts.aspect) {
      const height = `h_${Math.floor(size * opts.aspect)}`
      opts.transforms = opts.transforms ? `${opts.transforms},${height}` : height
    }

    return `${src(uri, size, opts)} ${size}w`
  }).join(',')
}

/**
 * Custom error with HTTP status code
 * @param {Number} status HTTP status code
 * @param {Error|String} err Error
 */
function HTTPError (status, err) {
  if (!(this instanceof HTTPError)) return new HTTPError(status, err)
  if (!err || typeof err === 'string') err = new Error(err)
  err.status = status
  Object.setPrototypeOf(err, Object.getPrototypeOf(this))
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, HTTPError)
  }
  return err
}

HTTPError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true
  }
})

if (Object.setPrototypeOf) {
  Object.setPrototypeOf(HTTPError, Error)
} else {
  HTTPError.__proto__ = Error // eslint-disable-line no-proto
}

/**
 * Create placeholder loading text of given length
 * @param {Number} length Loading text length
 * @param {Boolean} light Display loader on light background
 */
function loader (length, light = false) {
  var content = '⏳'.repeat(length).split('').reduce(function (str, char, index) {
    if (index && index % 3 === 0) char += ' '
    return str + char
  }, '')
  return html`<span class="u-loading${light ? 'Light' : ''}">${content}</span>`
}

/**
 * Get truncated snippet of text
 * @param {String} str Text string to truncate
 * @param {Number} maxlen Desired max length
 */
function truncate (str, maxlen = Infinity) {
  if (!str || str.length < maxlen) return str
  var words = str.split(' ')
  var snipped = ''
  while (snipped.length < maxlen) snipped += ' ' + words.shift()
  return [snipped, ' ', html`<span class="u-textNowrap">${words[0]}…</span>`]
}
