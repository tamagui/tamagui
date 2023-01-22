import { existsSync } from 'fs'
import { join } from 'path'

import { pathExists } from 'fs-extra'
import { $, cd } from 'zx'

const FROM = '1.0.0-rc.mdx'
const TO = '1.0.0.mdx'

main()

async function main() {
  const cdir = `apps/site/data/docs/components`
  cd(cdir)
  const out = await $`ls`
  const files = out.stdout.split('\n').map((x) => x.trim())
  await Promise.all(
    files.map(async (file) => {
      const [inf, outf] = [join(file, FROM), join(file, TO)]
      if (await pathExists(outf)) return
      if (!(await pathExists(inf))) {
        console.warn(`no input found`, inf)
        return
      }
      await $`mv ${inf} ${outf}`
    })
  )
}
