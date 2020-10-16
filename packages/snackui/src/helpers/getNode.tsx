import { findNodeHandle } from 'react-native'

export const getNode = (refCurrent: any): HTMLElement | null => {
  return findNodeHandle(refCurrent) as any
}
