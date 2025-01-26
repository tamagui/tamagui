import { useWindowDimensions } from 'tamagui'
import type { Dim } from './useContainerDim'

export const useContainerDim = (name: string): Dim => {
  const { width, height } = useWindowDimensions()

  return { width, height }
}
