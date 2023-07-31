import { useComposedRefs } from '@tamagui/compose-refs'
import {
  TamaguiElement,
  isWeb,
  isWebTouchable,
  useIsomorphicLayoutEffect,
} from '@tamagui/core'
import { ListItem, ListItemProps } from '@tamagui/list-item'
import * as React from 'react'

import { createSelectContext, useSelectItemParentContext } from './context'
import { ScopedProps } from './types'

/* -------------------------------------------------------------------------------------------------
 * SelectItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'SelectItem'

type SelectItemContextValue = {
  value: string
  textId: string
  isSelected: boolean
}

export const [SelectItemContextProvider, useSelectItemContext] =
  createSelectContext<SelectItemContextValue>(ITEM_NAME)

export interface SelectItemProps extends ListItemProps {
  value: string
  index: number
  disabled?: boolean
  textValue?: string
}

export const SelectItem = React.forwardRef<TamaguiElement, SelectItemProps>(
  (props: ScopedProps<SelectItemProps>, forwardedRef) => {
    const {
      __scopeSelect,
      value,
      disabled = false,
      textValue: textValueProp,
      index,
      ...itemProps
    } = props
    const context = useSelectItemParentContext(ITEM_NAME, __scopeSelect)

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
      initialValue,
    } = context

    const [isSelected, setSelected] = React.useState(initialValue === value)
    const [isActive, setActive] = React.useState(false)

    React.useEffect(() => {
      return activeIndexSubscribe((i) => {
        setActive(index === i)
      })
    }, [index])

    React.useEffect(() => {
      return valueSubscribe((val) => {
        setSelected(val === value)
      })
    }, [value])

    const textId = React.useId()

    const composedRefs = useComposedRefs(forwardedRef, (node) => {
      if (!isWeb) return
      if (node instanceof HTMLElement) {
        if (listRef) {
          listRef.current[index] = node
        }
      }
    })

    useIsomorphicLayoutEffect(() => {
      setValueAtIndex(index, value)
    }, [index, setValueAtIndex, value])

    function handleSelect() {
      setSelectedIndex(index)
      onChange(value)
      setOpen(false)
    }

    const selectItemProps = interactions
      ? interactions.getItemProps({
          ...(isWebTouchable
            ? {
                onTouchStart() {
                  allowSelectRef!.current = true
                  allowMouseUpRef!.current = false
                },
              }
            : {
                onTouchMove() {
                  allowSelectRef!.current = true
                  allowMouseUpRef!.current = false
                },
                onTouchEnd() {
                  allowSelectRef!.current = false
                  allowMouseUpRef!.current = true
                },
              }),

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

    useIsomorphicLayoutEffect(() => {
      if (isActive) {
        listRef?.current[index]?.focus()
      }
    }, [isActive])

    return (
      <SelectItemContextProvider
        scope={__scopeSelect}
        value={value}
        textId={textId || ''}
        isSelected={isSelected}
      >
        {shouldRenderWebNative ? (
          <option value={value}>{props.children}</option>
        ) : (
          <ListItem
            tag="div"
            componentName={ITEM_NAME}
            backgrounded
            pressTheme
            hoverTheme
            focusTheme
            cursor="default"
            outlineWidth={0}
            ref={composedRefs}
            aria-labelledby={textId}
            aria-selected={isSelected}
            data-state={isSelected ? 'active' : 'inactive'}
            aria-disabled={disabled || undefined}
            data-disabled={disabled ? '' : undefined}
            tabIndex={disabled ? undefined : -1}
            size={size}
            {...itemProps}
            {...selectItemProps}
          />
        )}
      </SelectItemContextProvider>
    )
  }
)

SelectItem.displayName = ITEM_NAME
