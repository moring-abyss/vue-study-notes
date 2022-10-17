'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/dom.esm-browser.prod.js')
} else {
  module.exports = require('./dist/dom.esm-browser.js')
}
