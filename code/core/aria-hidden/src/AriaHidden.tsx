import { hideOthers as ah } from 'aria-hidden'

type Undo = () => void

export const hideOthers: (
  originalTarget: Element | Element[],
  parentNode?: HTMLElement,
  markerName?: string
) => Undo = ah
