import { ExtractedResponse, TamaguiOptions } from '@tamagui/static'
import { LoaderContext } from 'webpack'

const extractedInfoByFile = new Map<string, ExtractedResponse>()
const stylePathToFilePath = new Map<string, string>()

export default function loader(this: LoaderContext<any>, source: string) {
  const callback = this.async()
  const threaded = this.emitFile === undefined
  const options: TamaguiOptions = { ...this.getOptions() }
  const sourcePath = `${this.resourcePath}`
  let out = ''
  if (options.cssPath) {
    // get in memory info
    const pathKey = stylePathToFilePath.get(sourcePath) ?? sourcePath
    const info = extractedInfoByFile.get(pathKey)
    // clear memory
    stylePathToFilePath.delete(sourcePath)
    extractedInfoByFile.delete(pathKey)
    const out = info?.styles
  } else if (options.cssData) {
    // get output CSS
    out = Buffer.from(options.cssData, 'base64').toString('utf-8')
  }
  if (options.cssData || options.cssPath) {
    if (!out) {
      console.warn(`no styles... ${extractedInfoByFile.keys} ${sourcePath}`)
    }
    // use original JS sourcemap
    return this.callback(null, out || '')
  }
  this.callback({ message: `No CSS found`, name: 'missing_css' })
}
