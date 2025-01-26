// vite cjs compat:
import * as DropZone from 'react-dropzone'

import type { DropZoneOptionsCustom } from '../types'

export function useDropZone(options: DropZoneOptionsCustom) {
  const accept = options.mediaTypes
    ?.map((mediaType) => mimTypes[mediaType])
    .reduce((a, b) => ({ ...a, ...b }))

  return DropZone.useDropzone({ ...options, accept: accept || { '*/*': [] } })
}

const mimTypes = {
  Images: {
    'image/*': [],
  },
  Videos: {
    'video/*': [],
  },
  Audios: {
    'audio/*': [],
  },
  All: {
    '*/*': [],
  },
}
