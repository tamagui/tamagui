import { useComposedRefs } from '@tamagui/compose-refs'
import { isTouchable, isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import type { ListItemProps } from '@tamagui/list-item'
import { ListItemFrame, useListItem } from '@tamagui/list-item'
import { createStyledContext } from '@tamagui/core'
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

export const SelectItem = ListItemFrame.styleable<SelectItemExtraProps>(
  function SelectItem(props: SelectScopedProps<SelectItemProps>, forwardedRef) {
    const {
      scope,
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

      // On mobile/touch devices, when you clicked on a SelectItem to select it:
      // 1. SelectItem's handleSelect would close the dropdown (setOpen(false))
      // 2. The press event would bubble up to the SelectTrigger
      // 3. Somehow the SelectTrigger would see the select is closed and toggle it back open
      // 4. Result: The dropdown immediately reopened after selecting an item

      // TODO: This is a hack to prevent the select from reopening when selecting the same item on mobile
      // On desktop: always close
      // On mobile: only close if selecting a different item
      if (!isTouchable || !isSelected) {
        setOpen(false)
      }
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
        scope={scope}
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
