import MediaQueryList from '@expo/match-media/build/MediaQueryList.js'

export const matchMedia = (media: string) => new MediaQueryList(media)

// @ts-ignore
globalThis['matchMedia'] = matchMedia
