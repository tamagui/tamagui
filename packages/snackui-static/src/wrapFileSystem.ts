// @ts-ignore
import { InputFileSystem } from 'webpack'

import { GLOSS_CSS_FILE } from './constants'

const handledMethods = {
  // exists: true,
  // existsSync: true,
  // readlink: true,
  // readlinkSync: true,
  mkdir: true,
  mkdirp: true,
  mkdirpSync: true,
  mkdirSync: true,
  readdir: true,
  readdirSync: true,
  readFile: true,
  readFileSync: true,
  rmdir: true,
  rmdirSync: true,
  stat: true,
  statSync: true,
  unlink: true,
  unlinkSync: true,
  writeFile: true,
  writeFileSync: true,
}

export function wrapFileSystem(fs, memoryFS): InputFileSystem {
  return new Proxy(fs, {
    get: (target, key) => {
      const value = target[key]

      if (handledMethods.hasOwnProperty(key)) {
        return function (this: any, filePath: string, ...args: string[]) {
          if (filePath.endsWith(GLOSS_CSS_FILE)) {
            return memoryFS[key](filePath, ...args)
          }
          return value.call(this, filePath, ...args)
        }
      }

      return value
    },
  })
}
