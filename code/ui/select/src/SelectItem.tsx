import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import { createStyledHOC, createStyledContext, styled, View } from '@tamagui/core'
import type { GetProps } from '@tamagui/core'
import { composeEventHandlers } from '@tamagui/helpers'
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
  extends
    Omit<GetProps<typeof SelectItemFrame>, keyof SelectItemExtraProps>,
    SelectItemExtraProps {}

export const SelectItemFrame = styled(View, {
  name: ITEM_NAME,
  alignItems: 'center',
  flexDirection: 'row',
})

export const SelectItem = createStyledHOC(SelectItemFrame)<SelectItemExtraProps>(
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
      activeIndexRef,
      valueSubscribe,
      allowMouseUpRef,
      allowSelectRef,
      setValueAtIndex,
      selectTimeoutRef,
      dataRef,
      interactions,
      shouldRenderWebNative,
      onActiveChange,
      initialValue,
      setActiveIndexFast,
    } = context

    const [isSelected, setSelected] = React.useState(initialValue === value)
    const pendingMouseUpSelectionRef = React.useRef(false)

    // set initial selectedIndex when this item matches the initial value
    useIsomorphicLayoutEffect(() => {
      if (initialValue === value) {
        setSelectedIndex(index)
      }
    }, [])

    React.useEffect(() => {
      const handleActiveIndex = (i: number) => {
        if (index === i) {
          onActiveChange(value, index)
          if (isWeb) {
            // use rAF to focus after browser's click handling completes
            // this prevents the trigger from stealing focus after we set it
            requestAnimationFrame(() => {
              listRef?.current[index]?.focus()
            })
          }
        }
      }

      // check initial value (parent effect may have set it before we subscribed)
      const currentActiveIndex = activeIndexRef?.current
      if (currentActiveIndex !== null && currentActiveIndex !== undefined) {
        handleActiveIndex(currentActiveIndex)
      }

      return activeIndexSubscribe(handleActiveIndex)
    }, [index])

    React.useEffect(() => {
      return valueSubscribe((val) => {
        setSelected(val === value)
      })
    }, [value])

    const textId = React.useId()

    const refCallback = React.useCallback(
      (node) => {
        if (!isWeb) return
        if (node instanceof HTMLElement) {
          if (listRef) {
            listRef.current[index] = node
          }
        }
      },
      [index, listRef]
    )

    const composedRefs = useComposedRefs(forwardedRef, refCallback)

    useIsomorphicLayoutEffect(() => {
      setValueAtIndex(index, value)
    }, [index, setValueAtIndex, value])

    function handleSelect() {
      if (disabled) return
      setSelectedIndex(index)
      onChange(value)
      setOpen(false)
    }

    const selectItemProps = React.useMemo(() => {
      if (interactions) {
        const {
          onTouchMove,
          onTouchEnd,
          onKeyDown,
          onClick,
          onMouseUp,
          onPress,
          ...itemProps
        } = restProps
        const interactionProps = interactions.getItemProps({
          ...itemProps,
          onTouchMove() {
            allowSelectRef!.current = true
            allowMouseUpRef!.current = false
          },
          onTouchEnd() {
            allowSelectRef!.current = false
            allowMouseUpRef!.current = true
          },
          onKeyDown(event) {
            if (disabled) return
            if (
              event.key === 'Enter' ||
              (event.key === ' ' && !dataRef?.current.typing)
            ) {
              event.preventDefault()
              handleSelect()
            } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              // prevent default and stop propagation so floating-ui doesn't also handle
              event.preventDefault()
              event.stopPropagation()
              const itemCount = listRef?.current.length ?? 0
              if (itemCount === 0) return

              let nextIndex: number
              if (event.key === 'ArrowDown') {
                nextIndex = index + 1 >= itemCount ? 0 : index + 1
              } else {
                nextIndex = index - 1 < 0 ? itemCount - 1 : index - 1
              }
              // use fast setter to avoid triggering state updates that reset activeIndex
              setActiveIndexFast?.(nextIndex)
            } else {
              allowSelectRef!.current = true
            }
          },
          onClick() {
            if (disabled) return
            const shouldSelect =
              pendingMouseUpSelectionRef.current || allowSelectRef!.current
            pendingMouseUpSelectionRef.current = false
            clearTimeout(selectTimeoutRef!.current)
            allowSelectRef!.current = true
            if (shouldSelect) {
              handleSelect()
            }
          },
          onMouseUp() {
            if (disabled) return
            if (!allowMouseUpRef!.current) {
              // Re-enable mouseup and selection for subsequent interactions
              allowMouseUpRef!.current = true
              allowSelectRef!.current = true
              return
            }

            pendingMouseUpSelectionRef.current = allowSelectRef!.current

            // A normal click follows mouseup synchronously. Defer the drag-release
            // fallback so the caller's onClick runs before selection closes the item.
            clearTimeout(selectTimeoutRef!.current)
            selectTimeoutRef!.current = setTimeout(() => {
              allowSelectRef!.current = true
              if (pendingMouseUpSelectionRef.current) {
                pendingMouseUpSelectionRef.current = false
                handleSelect()
              }
            })
          },
        } as any)

        return {
          ...interactionProps,
          onTouchMove: composeEventHandlers(
            onTouchMove as any,
            interactionProps.onTouchMove
          ),
          onTouchEnd: composeEventHandlers(
            onTouchEnd as any,
            interactionProps.onTouchEnd
          ),
          onKeyDown: composeEventHandlers(onKeyDown as any, interactionProps.onKeyDown),
          onClick(event: any) {
            onClick?.(event)
            if (event.defaultPrevented) {
              pendingMouseUpSelectionRef.current = false
              clearTimeout(selectTimeoutRef!.current)
              allowSelectRef!.current = true
              return
            }
            interactionProps.onClick?.(event)
          },
          onMouseUp: composeEventHandlers(onMouseUp as any, interactionProps.onMouseUp),
          onPress,
        }
      }

      return {
        ...restProps,
        onPress: composeEventHandlers(restProps.onPress as any, handleSelect),
      }
    }, [handleSelect, index, listRef, setActiveIndexFast])

    return (
      <SelectItemContextProvider
        scope={scope}
        value={value}
        textId={textId || ''}
        isSelected={isSelected}
      >
        {shouldRenderWebNative ? (
          <option value={value} disabled={disabled}>
            {props.children}
          </option>
        ) : (
          <SelectItemFrame
            render="div"
            ref={composedRefs}
            role="option"
            aria-labelledby={textId}
            aria-selected={isSelected}
            data-state={isSelected ? 'active' : 'inactive'}
            aria-disabled={disabled || undefined}
            data-disabled={disabled ? '' : undefined}
            tabIndex={disabled ? undefined : -1}
            zIndex={100}
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
