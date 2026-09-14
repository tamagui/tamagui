import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

/**
 * Runs generated source through the repo formatter.
 *
 * The generators emit source, `bun run lint` runs `oxfmt --check` over the
 * repo, and the freshness tests compare the generated source to what is checked
 * in. Those three only agree if the generated source is already formatted, and
 * hand-matching a formatter's line-wrapping from a template is exactly the kind
 * of thing that works until a tag name gets longer. So the generators format
 * their own output, and the tests compare against the same formatted result.
 *
 * oxfmt has no stdin mode, hence the temp file.
 */
export function format(source: string, filename: string): string {
  const path = join(mkdtempSync(join(tmpdir(), 'tamagui-dom-')), filename)
  writeFileSync(path, source)
  execFileSync(
    join(import.meta.dirname, '..', '..', '..', '..', 'node_modules', '.bin', 'oxfmt'),
    [path]
  )
  return readFileSync(path, 'utf8')
}
