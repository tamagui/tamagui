import { MediaQueryState, useMedia } from './useMedia'

type ValueOf<T> = T[keyof T]

export function createUseScale<
  A,
  B = Required<Omit<A, 'media'>>,
  Val = ValueOf<B>
>(
  scaleProps: A & {
    media?: { [key in keyof MediaQueryState]?: B }
  }
) {
  const { media: scaleMedia, ...props } = scaleProps
  const defaults = (props as any) as B

  return function useScale(active: keyof B): Val {
    if (scaleMedia) {
      const media = useMedia()
      const activeMediaKey = getActiveMedia(media)
      if (activeMediaKey) {
        return scaleMedia[activeMediaKey]
      }
    }
    // @ts-expect-error
    return defaults[active]
  }
}

function getActiveMedia(media: MediaQueryState) {
  const mediaKeys = Object.keys(media)
  for (const key of mediaKeys) {
    if (mediaKeys[key]) {
      return key
    }
  }
  return null
}

// const useFontSize = createUseScale({
//   sm: 10,
//   md: 20,
//   lg: 30,

//   media: {
//     sm: {
//       sm: 10,
//       md: 20,
//       lg: 30,
//     },
//   },
// })

// const x = useFontSize('sm')
