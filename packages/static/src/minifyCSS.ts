import browserslist from 'browserslist'
import { browserslistToTargets, transform } from 'lightningcss'

export function minifyCSS(input: string) {
  return transform({
    filename: 'style.css',
    code: Buffer.from(input),
    minify: true,
    targets: browserslistToTargets(browserslist('>= 0.5%')),
    sourceMap: true,
  })
}
