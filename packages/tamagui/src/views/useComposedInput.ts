import { TamaguiReactElement, isTamaguiElement } from '@tamagui/web'
import { Children, ReactNode, cloneElement, useMemo } from 'react'

export const START_INPUT_ADORNMENT_NAME = 'StartInputAdornment'
export const END_INPUT_ADORNMENT_NAME = 'EndInputAdornment'

interface ComposedInputComponents {
  startAdornments?: TamaguiReactElement[]
  endAdornments?: TamaguiReactElement[]
}

export const useComposedInput = (children: ReactNode) => {
  return useMemo(() => {
    const childrenArray = Children.toArray(children)
    const resultChildren: typeof childrenArray = []

    const result: ComposedInputComponents = {
      startAdornments: [],
      endAdornments: [],
    }

    childrenArray.forEach((child) => {
      if (isTamaguiElement(child, START_INPUT_ADORNMENT_NAME)) {
        result.startAdornments?.push(child)
        return
      }

      if (isTamaguiElement(child, END_INPUT_ADORNMENT_NAME)) {
        let passedChild = child
        if (!result.endAdornments?.length) {
          passedChild = cloneElement(child, { isEnd: true }) as TamaguiReactElement
        }
        result.endAdornments?.push(passedChild)
        return
      }

      resultChildren.push(child)
    })

    return result
  }, [children])
}
