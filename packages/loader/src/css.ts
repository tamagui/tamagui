import { ExtractedResponse, TamaguiOptions } from '@tamagui/static'
import { LoaderContext } from 'webpack'

export const extractedInfoByFile = new Map<string, ExtractedResponse>()
export const stylePathToFilePath = new Map<string, string>()

export default function loader(this: LoaderContext<any>) {
  this.async()
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
    return this.callback(null, out || '')
  } else if (options.cssData) {
    // get output CSS
    out = Buffer.from(options.cssData, 'base64').toString('utf-8')
  }
  if (out) {
    // use original JS sourcemap
    return this.callback(null, out || '')
  }
  this.callback({ message: 'No CSS found', name: 'missing_css' })
}
