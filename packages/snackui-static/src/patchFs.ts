import fs from 'fs'

import { patchFs } from 'fs-monkey'
import { Volume, createFsFromVolume } from 'memfs'
import { Union } from 'unionfs'

export const memoryFS = createFsFromVolume(new Volume())

const ufs = new Union()
ufs
  // @ts-expect-error
  .use(this.memoryFS)
  .use({ ...fs })

const ogw = fs.watch
const ogwf = fs.watchFile
const ogcws = fs.createWriteStream
patchFs(ufs)
// temp bugfix: watch was broken, disable it on memfs
fs.watch = ogw
fs.watchFile = ogwf
// temp bugfix: caused webpack Caching failed for pack: TypeError: stream.write is not a function
fs.createWriteStream = ogcws
