import type { UseMediaState } from '@tamagui/web'
import { useMedia } from 'tamagui'

export const useGroupMedia = (name: string): UseMediaState => {
  const allMedia = useMedia()

  return allMedia
}
