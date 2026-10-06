// turns `one build` output into a fully static site in dist/client for
// cloudflare static assets (wrangler.jsonc): writes the text files the node
// middleware serves on request, the redirects, client-rendered route fallbacks
// and the 404 page.

import fs from 'node:fs'
import path from 'node:path'
import {
  buildLlmsTxt,
  docsDir,
  getAllMdxFiles,
  getComponentVersions,
} from '../features/docs/docsSourceFiles'
import { redirects } from '../redirects'

const out = path.join(process.cwd(), 'dist/client')

function write(file: string, content: string) {
  const target = path.join(out, file)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, content)
}

const llms = buildLlmsTxt()
for (const name of ['llms.txt', 'llms-full.txt', 'docs.txt']) {
  write(name, llms)
}

// /docs/<path>.md is the raw source of each docs page
for (const file of getAllMdxFiles()) {
  const relativePath = path.relative(docsDir, file).replace(/\.mdx$/, '')
  write(`docs/${relativePath}.md`, fs.readFileSync(file, 'utf-8'))
}

// /ui/<component>.md is the newest version of that component's docs
for (const [component, versions] of getComponentVersions()) {
  if (!versions[0]) continue
  write(
    `ui/${component}.md`,
    fs.readFileSync(path.join(docsDir, 'components', component, `${versions[0]}.mdx`), 'utf-8')
  )
}

fs.copyFileSync(path.join(out, '+not-found.html'), path.join(out, '404.html'))

// client-rendered catch-all routes (`[...x]+spa`) build one shell, named `=2a.html`
// for the `*` segment; every path under the route renders from it. the shell is
// copied to `_spa.html` because asset paths with `=` redirect to their encoded form
const spaRewrites: string[] = []
function findSpaShells(dir: string) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) findSpaShells(full)
    else if (entry.name === '=2a.html') {
      fs.copyFileSync(full, path.join(dir, '_spa.html'))
      const route = `/${path.relative(out, dir).split(path.sep).join('/')}`
      spaRewrites.push(`${route}/* ${route}/_spa 200`)
    }
  }
}
findSpaShells(out)

write(
  '_redirects',
  [
    ...redirects.map(
      ({ source, destination, permanent }) =>
        `${source} ${destination} ${permanent ? 301 : 302}`
    ),
    ...spaRewrites,
  ].join('\n') + '\n'
)

console.info(
  `static: ${redirects.length} redirects, ${spaRewrites.length} client-rendered routes`
)
