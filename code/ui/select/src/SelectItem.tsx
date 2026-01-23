import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import { createStyledContext } from '@tamagui/core'
import type { ListItemProps } from '@tamagui/list-item'
import { ListItem } from '@tamagui/list-item'
import * as React from 'react'
import { useSelectItemParentContext } from './context'
import type { SelectScopedProps } from './types'

/* -------------------------------------------------------------------------------------------------
 * SelectItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'SelectItem'

type SelectItemContextValue = {
  value: string
  textId: string
  isSelected: boolean
}

export const {
  Provider: SelectItemContextProvider,
  useStyledContext: useSelectItemContext,
} = createStyledContext<SelectItemContextValue>(null as any, ITEM_NAME)

export interface SelectItemExtraProps {
  value: string
  index: number
  disabled?: boolean
  textValue?: string
}

export interface SelectItemProps
  extends Omit<ListItemProps, keyof SelectItemExtraProps>,
    SelectItemExtraProps {}

export const SelectItem = ListItem.Frame.styleable<SelectItemExtraProps>(
  function SelectItem(props: SelectScopedProps<SelectItemProps>, forwardedRef) {
    const {
      scope,
      value,
      disabled = false,
      textValue: textValueProp,
      index,
      ...restProps
    } = props

    const context = useSelectItemParentContext(scope)

    const {
      setSelectedIndex,
      listRef,
      setOpen,
      onChange,
      activeIndexSubscribe,
      valueSubscribe,
      allowMouseUpRef,
      allowSelectRef,
      setValueAtIndex,
      selectTimeoutRef,
      dataRef,
      interactions,
      shouldRenderWebNative,
      size,
      onActiveChange,
      initialValue,
    } = context

    const [isSelected, setSelected] = React.useState(initialValue === value)

    React.useEffect(() => {
      return activeIndexSubscribe((i) => {
        const isActive = index === i

        if (isActive) {
          onActiveChange(value, index)

          if (isWeb) {
            // focus for focusStyles to apply
            listRef?.current[index]?.focus()
          }
        }
      })
    }, [index])

    React.useEffect(() => {
      return valueSubscribe((val) => {
        setSelected(val === value)
      })
    }, [value])

    const textId = React.useId()

    const refCallback = React.useCallback((node) => {
      if (!isWeb) return
      if (node instanceof HTMLElement) {
        if (listRef) {
          listRef.current[index] = node
        }
      }
    }, [])

    const composedRefs = useComposedRefs(forwardedRef, refCallback)

    useIsomorphicLayoutEffect(() => {
      setValueAtIndex(index, value)
    }, [index, setValueAtIndex, value])

    function handleSelect() {
      setSelectedIndex(index)
      onChange(value)
      setOpen(false)
    }

    const selectItemProps = React.useMemo(() => {
      return interactions
        ? interactions.getItemProps({
            onTouchMove() {
              allowSelectRef!.current = true
              allowMouseUpRef!.current = false
            },
            onTouchEnd() {
              allowSelectRef!.current = false
              allowMouseUpRef!.current = true
            },
            onKeyDown(event) {
              if (
                event.key === 'Enter' ||
                (event.key === ' ' && !dataRef?.current.typing)
              ) {
                event.preventDefault()
                handleSelect()
              } else {
                allowSelectRef!.current = true
              }
            },

            onClick() {
              if (allowSelectRef!.current) {
                handleSelect()
              }
            },

            onMouseUp() {
              if (!allowMouseUpRef!.current) {
                // Re-enable mouseup and selection for subsequent interactions
                allowMouseUpRef!.current = true
                allowSelectRef!.current = true
                return
              }

              if (allowSelectRef!.current) {
                handleSelect()
              }

              // On touch devices, prevent the element from
              // immediately closing `onClick` by deferring it
              clearTimeout(selectTimeoutRef!.current)
              selectTimeoutRef!.current = setTimeout(() => {
                allowSelectRef!.current = true
              })
            },
          })
        : {
            onPress: handleSelect,
          }
    }, [handleSelect])

    return (
      <SelectItemContextProvider
        scope={scope}
        value={value}
        textId={textId || ''}
        isSelected={isSelected}
      >
        {shouldRenderWebNative ? (
          <option value={value}>{props.children}</option>
        ) : (
          <ListItem.Frame
            render="div"
            componentName={ITEM_NAME}
            ref={composedRefs}
            aria-labelledby={textId}
            aria-selected={isSelected}
            data-state={isSelected ? 'active' : 'inactive'}
            aria-disabled={disabled || undefined}
            data-disabled={disabled ? '' : undefined}
            tabIndex={disabled ? undefined : -1}
            {...(!props.unstyled && {
              cursor: 'default',
              size,
              outlineOffset: -0.5,
              zIndex: 100,

              hoverStyle: {
                backgroundColor: '$backgroundHover',
              },

              pressStyle: {
                backgroundColor: '$backgroundPress',
              },

              focusStyle: {
                backgroundColor: '$backgroundFocus',
              },

              focusVisibleStyle: {
                outlineColor: '$outlineColor',
                outlineWidth: 1,
                outlineStyle: 'solid',
              },
            })}
            {...restProps}
            {...selectItemProps}
          />
        )}
      </SelectItemContextProvider>
    )
  },
  {
    disableTheme: true,
  }
)
