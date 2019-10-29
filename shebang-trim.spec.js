'use strict'

const { promises: fs } = require('fs')
const tmp = require('tmp-promise')
const { expect } = require('chai')
const { rewriteShebang } = require('.')

describe('shebang-trim', () => {
  let path, cleanup
  beforeEach(async () => {
    ;({ path, cleanup } = await tmp.file())
  })
  afterEach(async () => {
    cleanup()
    path = cleanup = undefined
  })

  async function writeSource(source) {
    await fs.writeFile(path, source, 'utf8')
  }

  describe('rewriteShebang', () => {
    it('when a file contains the old shebang, it rewrites it', async () => {
      const source = `#!/usr/bin/env ts-node
      function main() {
        console.log('Hello, world!')
      }
      `
      await writeSource(source)

      await rewriteShebang(path)

      const newContents = await fs.readFile(path, 'utf8')
      expect(newContents).to.equal(source.replace('ts-node', 'node'))
    })

    it('when a file contains the new shebang, it does nothing', async () => {
      const source = `#!/usr/bin/env node
      function main() {
        console.log('Hello, world!')
      }
      `
      await writeSource(source)

      await rewriteShebang(path)

      const newContents = await fs.readFile(path, 'utf8')
      expect(newContents).to.equal(source)
    })

    it('when a file has the wrong shebang, it throws the expected error', async () => {
      await writeSource(`#!/usr/bin/env python3
      def main():
          print("hi")
      `)

      await expect(rewriteShebang(path)).to.be.rejectedWith(
        Error,
        'Cowardly refusing to convert unknown shebang: #!/usr/bin/env python3'
      )
    })

    it('when a file has no shebang, it throws the expected error', async () => {
      await writeSource(`def main():
          print("hi")
      `)

      await expect(rewriteShebang(path)).to.be.rejectedWith(
        Error,
        'Not a shebang'
      )
    })

    it('when a file is empty, it throws the expected error', async () => {
      await expect(rewriteShebang(path)).to.be.rejectedWith(
        Error,
        'File is empty'
      )
    })
  })
})
