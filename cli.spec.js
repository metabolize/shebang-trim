'use strict'

const { promises: fs } = require('fs')
const tmp = require('tmp-promise')
const { expect } = require('chai')
const { main } = require('./cli')

describe('The CLI', () => {
  let file1, file2
  beforeEach(async () => {
    file1 = await tmp.file()
    file2 = await tmp.file()
  })
  afterEach(async () => {
    if (file1) {
      await file1.cleanup()
      file1 = undefined
    }
    if (file2) {
      await file2.cleanup()
      file2 = undefined
    }
  })

  const source = `#!/usr/bin/env ts-node
      function main() {
        console.log('Hello, world!')
      }
      `

  beforeEach(async () => {
    await fs.writeFile(file1.path, source, 'utf8')
    await fs.writeFile(file2.path, source, 'utf8')
  })

  it('rewrites the files', async () => {
    await main(['node', 'cli.js', file1.path, file2.path])

    for (const { path } of [file1, file2]) {
      const newContents = await fs.readFile(path, 'utf8')
      expect(newContents).to.equal(source.replace('ts-node', 'node'))
    }
  })
})
