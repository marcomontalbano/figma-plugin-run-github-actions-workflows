const path = require('path')
const realCore = require('@actions/core')
const assert = require('assert')

const actual = []

require.cache[require.resolve('@actions/core')].exports = {
  ...realCore,
  setOutput: (name, value) => actual.push({ name, value })
}

require('./main')

assert.deepStrictEqual(actual, [
  {
    name: 'fileKey',
    value: 'VQxKo2pnaksjE7Vql999Qv'
  },
  {
    name: 'ids',
    value: [
      '2398:811',
      '2398:818'
    ]
  }
])
