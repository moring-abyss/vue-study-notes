'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/core.esm-browser.prod.js')
} else {
  module.exports = require('./dist/core.esm-browser.js')
}
