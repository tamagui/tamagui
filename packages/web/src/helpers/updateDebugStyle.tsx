import { StaticConfig, TamaguiComponent } from '../types'

const debugStyleCache = new Map<
  'XStack' | 'YStack' | 'ZStack' | '[Unnamed Component]',
  {
    borderColor?: string
  }
>()

const Config = {
  XStack: {
    borderColor: 'red',
  },
  YStack: {
    borderColor: 'green',
  },
  ZStack: {
    borderColor: 'blue',
  },
  '[Unnamed Component]': {
    borderColor: 'purple',
  },
}

export const updateDebugStyle = (
  name: 'XStack' | 'YStack' | 'ZStack' | '[Unnamed Component]'
) => {
  const cache = debugStyleCache.get(name)

  if (cache) {
    return cache
  }
  debugStyleCache.set(name, Config[name])

  return debugStyleCache.get(name)
}
