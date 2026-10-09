// vite cjs compat:
import * as DropZone from 'react-dropzone'

import { MediaTypeOptions, type DropZoneOptionsCustom } from '../types'

export function useDropZone(options: DropZoneOptionsCustom) {
  const accept = options.mediaTypes?.includes(MediaTypeOptions.All)
    ? undefined
    : options.mediaTypes
        ?.map((mediaType) => mimTypes[mediaType])
        .reduce((a, b) => ({ ...a, ...b }))

  return DropZone.useDropzone({ ...options, accept })
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
  All: {},
}
