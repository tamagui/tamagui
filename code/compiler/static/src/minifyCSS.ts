import browserslist from 'browserslist'

export function minifyCSS(input: string) {
  const { transform, browserslistToTargets } = require('lightningcss')
  return transform({
    filename: 'style.css',
    code: Buffer.from(input),
    minify: true,
    targets: browserslistToTargets(browserslist('>= 0.5%')),
    sourceMap: true,
  })
}
