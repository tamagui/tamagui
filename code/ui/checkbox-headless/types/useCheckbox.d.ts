import React from 'react'
import type { PressableProps, ViewProps } from '@tamagui/react-native-types'
export type CheckedState = boolean | 'indeterminate'
type CheckboxBaseProps = Omit<ViewProps, 'onFocus' | 'onBlur'> &
  Pick<PressableProps, 'onPress'>
export type CheckboxExtraProps = {
  children?: React.ReactNode
  id?: string
  disabled?: boolean
  checked?: CheckedState
  defaultChecked?: CheckedState
  required?: boolean
  /**
   *
   * @param checked Either boolean or "indeterminate" which is meant to allow for a third state that means "neither", usually indicated by a minus sign.
   */
  onCheckedChange?(checked: CheckedState): void
  labelledBy?: string
  name?: string
  value?: string
}
export type CheckboxProps = CheckboxBaseProps & CheckboxExtraProps
type CheckboxBehaviorProps = CheckboxExtraProps & {
  onPress?: PressableProps['onPress']
}
export declare function useCheckbox<R, P extends CheckboxBehaviorProps>(
  props: P,
  [checked, setChecked]: [
    CheckedState,
    React.Dispatch<React.SetStateAction<CheckedState>>,
  ],
  ref: React.Ref<R> | undefined
): {
  bubbleInput: React.JSX.Element | null
  checkboxRef: (node: R | null) => void
  checkboxProps: {
    role: 'checkbox'
    'aria-labelledby': string | undefined
    'aria-checked': 'mixed' | boolean
  } & Omit<
    P,
    'disabled' | 'labelledBy' | 'name' | 'onCheckedChange' | 'required' | 'value'
  > & {
      type?: string | undefined
      value?: string | undefined
      'data-state'?: string | undefined
      'data-disabled'?: string | undefined
      disabled?: boolean | undefined
      onKeyDown?:
        | import('@tamagui/helpers').EventHandler<React.KeyboardEvent<HTMLButtonElement>>
        | undefined
      onPress:
        | import('@tamagui/helpers').EventHandler<
            Readonly<
              Omit<
                Readonly<{
                  bubbles: boolean | undefined
                  cancelable: boolean | undefined
                  currentTarget:
                    | number
                    | import('@tamagui/react-native-types').HostInstance
                  defaultPrevented: boolean | undefined
                  dispatchConfig: Readonly<{
                    registrationName: string
                  }>
                  eventPhase: number | undefined
                  preventDefault: () => void
                  isDefaultPrevented: () => boolean
                  stopPropagation: () => void
                  isPropagationStopped: () => boolean
                  isTrusted: boolean | undefined
                  nativeEvent: Readonly<{
                    changedTouches: ReadonlyArray<
                      import('@tamagui/react-native-types').NativeTouchEvent
                    >
                    force?: number | undefined
                    identifier: number
                    locationX: number
                    locationY: number
                    pageX: number
                    pageY: number
                    target: number | undefined
                    timestamp: number
                    touches: ReadonlyArray<
                      import('@tamagui/react-native-types').NativeTouchEvent
                    >
                  }>
                  persist: () => void
                  target:
                    | (number | undefined)
                    | import('@tamagui/react-native-types').HostInstance
                  timeStamp: number
                  type: string | undefined
                }>,
                'touchHistory'
              > & {
                touchHistory: Readonly<{
                  indexOfSingleActiveTouch: number
                  mostRecentTimeStamp: number
                  numberActiveTouches: number
                  touchBank: ReadonlyArray<
                    Readonly<{
                      touchActive: boolean
                      startPageX: number
                      startPageY: number
                      startTimeStamp: number
                      currentPageX: number
                      currentPageY: number
                      currentTimeStamp: number
                      previousPageX: number
                      previousPageY: number
                      previousTimeStamp: number
                    }>
                  >
                }>
              }
            >
          >
        | undefined
    }
}
export {}
//# sourceMappingURL=useCheckbox.d.ts.map
