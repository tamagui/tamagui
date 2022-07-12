import findCacheDir from 'find-cache-dir'

export const CSS_FILE_NAME = '__snack.css'

// ENSURE THIS ISNT THE SAME AS THE SEPARATOR USED FOR STYLE KEYS
// SEE matching one in concatClassName
export const MEDIA_SEP = '_'

// ensure cache dir
export const cacheDir = findCacheDir({ name: 'tamagui', create: true })

export const FAILED_EVAL = Symbol('failed_style_eval')
export const CONCAT_CLASSNAME_IMPORT = 'concatClassName'

export const SHOULD_DEBUG = process.env.DEBUG === '*' || process.env.DEBUG?.startsWith('tamagui')
