#!/usr/bin/env node

'use strict'

const { rewriteShebang } = require('.')

async function main(inArgs) {
  const filenames = inArgs.slice(2)
  for (const filename of filenames) {
    await rewriteShebang(filename)
  }
}

module.exports = { main }

/* istanbul ignore next */
if (require.main === module) {
  ;(async () => {
    try {
      await main(process.argv)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  })()
}
