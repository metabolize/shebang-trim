'use strict'

const fs = require('fs')
const readline = require('readline')
const writeFileAtomically = require('write-file-atomically')

const oldShebang = '#!/usr/bin/env ts-node'
const oldShebangScriptMode = '#!/usr/bin/env ts-node-script'
const newShebang = '#!/usr/bin/env node'

function transformShebangLine(line) {
  if (!line.startsWith('#!')) {
    throw Error('Not a shebang')
  }

  if (
    line === oldShebang ||
    line === oldShebangScriptMode ||
    line === newShebang
  ) {
    return newShebang
  } else {
    throw Error(`Cowardly refusing to convert unknown shebang: ${line}`)
  }
}

async function rewriteShebang(filename) {
  const lineIterator = readline
    .createInterface({
      input: fs.createReadStream(filename),
      crlfDelay: Infinity,
    })
    [Symbol.asyncIterator]()

  const { done, value: firstLine } = await lineIterator.next()

  if (done) {
    throw Error('File is empty')
  }

  const transformed = transformShebangLine(firstLine)

  const lines = [transformed]
  for await (const line of lineIterator) {
    lines.push(line)
  }

  await writeFileAtomically(filename, lines.join('\n'))
}

module.exports = { transformShebangLine, rewriteShebang }
