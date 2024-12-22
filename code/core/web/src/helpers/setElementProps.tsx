import { hooks } from '../setupHooks'

export const setElementProps = (node) => {
  hooks.setElementProps?.(node)
}
