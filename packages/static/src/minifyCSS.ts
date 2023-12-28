import { transform } from 'lightningcss'

export function minifyCSS(input: string) {
  return transform({
    filename: 'style.css',
    code: Buffer.from(input),
    minify: true,
    sourceMap: true,
  })
}
