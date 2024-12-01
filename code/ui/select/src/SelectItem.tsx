import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import type { ListItemProps } from '@tamagui/list-item'
import { ListItemFrame, useListItem } from '@tamagui/list-item'
import * as React from 'react'

import { createSelectContext, useSelectItemParentContext } from './context'
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

export const [SelectItemContextProvider, useSelectItemContext] =
  createSelectContext<SelectItemContextValue>(ITEM_NAME)

export interface SelectItemExtraProps {
  value: string
  index: number
  disabled?: boolean
  textValue?: string
}

export interface SelectItemProps
  extends Omit<ListItemProps, keyof SelectItemExtraProps>,
    SelectItemExtraProps {}

export const SelectItem = ListItemFrame.styleable<SelectItemExtraProps>(
  function SelectItem(props: SelectScopedProps<SelectItemProps>, forwardedRef) {
    const {
      __scopeSelect,
      value,
      disabled = false,
      textValue: textValueProp,
      index,
      ...restProps
    } = props

    const { props: listItemProps } = useListItem({
      ...(!props.unstyled && {
        ellipse: true,
      }),
      ...restProps,
    })

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
      onActiveChange,
      initialValue,
    } = context

    const [isSelected, setSelected] = React.useState(initialValue === value)

    React.useEffect(() => {
      return activeIndexSubscribe((i) => {
        const isActive = index === i

        if (isActive) {
          onActiveChange(value, index)
          listRef?.current[index]?.focus()
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
        scope={__scopeSelect}
        value={value}
        textId={textId || ''}
        isSelected={isSelected}
      >
        {shouldRenderWebNative ? (
          <option value={value}>{props.children}</option>
        ) : (
          <ListItemFrame
            tag="div"
            componentName={ITEM_NAME}
            ref={composedRefs}
            aria-labelledby={textId}
            aria-selected={isSelected}
            data-state={isSelected ? 'active' : 'inactive'}
            aria-disabled={disabled || undefined}
            data-disabled={disabled ? '' : undefined}
            tabIndex={disabled ? undefined : -1}
            {...(!props.unstyled && {
              backgrounded: true,
              pressTheme: true,
              hoverTheme: true,
              focusTheme: true,
              cursor: 'default',
              size,
              outlineOffset: -0.5,

              focusVisibleStyle: {
                outlineColor: '$outlineColor',
                outlineWidth: 1,
                outlineStyle: 'solid',
              },
            })}
            {...listItemProps}
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
