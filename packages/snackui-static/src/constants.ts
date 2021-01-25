import findCacheDir from 'find-cache-dir'

export const CSS_FILE_NAME = '__snack.css'

export const CLASS_PREFIX = '_'

// ENSURE THIS ISNT THE SAME AS THE SEPARATOR USED FOR STYLE KEYS
// SEE matching one in concatClassName
export const MEDIA_SEP = '_'

// ensure cache dir
export const cacheDir = findCacheDir({ name: 'snackui', create: true })
