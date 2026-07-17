import { useComposedRefs } from '@tamagui/compose-refs'
import { useAdaptIsActive } from '@tamagui/adapt'
import { isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import {
  createChangeEventDetails,
  createStyledHOC,
  createStyledContext,
  styled,
  View,
} from '@tamagui/core'
import type { GetProps } from '@tamagui/core'
import { composeEventHandlers } from '@tamagui/helpers'
import * as React from 'react'
import { useSelectContext, useSelectItemParentContext } from './context'
import { getSelectOptionProps } from './selectionController'
import type {
  SelectActiveChangeDetails,
  SelectScopedProps,
  SelectValueChangeDetails,
} from './types'

/* -------------------------------------------------------------------------------------------------
 * SelectItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'SelectItem'

type SelectItemContextValue = {
  value: string
  textId: string
  textValue?: string
  isSelected: boolean
}

export const {
  Provider: SelectItemContextProvider,
  useStyledContext: useSelectItemContext,
} = createStyledContext<SelectItemContextValue>(null as any, ITEM_NAME)

export interface SelectItemExtraProps {
  value: string
  /** @deprecated registry order is authoritative. this prop is accepted but inert. */
  index?: number
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
      disabled: disabledProp,
      'aria-disabled': ariaDisabled,
      textValue: textValueProp,
      index: _index,
      ...restProps
    } = props
    const disabled = disabledProp ?? ariaDisabled === true

    const context = useSelectItemParentContext(scope)
    const selectContext = useSelectContext(scope)
    const isAdapted = useAdaptIsActive(selectContext.adaptScope)

    const {
      listRef,
      registry,
      mode,
      selectedValues,
      selectValue,
      activeIndexSubscribe,
      activeIndexRef,
      allowMouseUpRef,
      allowSelectRef,
      selectTimeoutRef,
      interactions,
      shouldRenderWebNative,
      setActiveIndexFast,
      moveActive,
      search,
    } = context

    const isSelected = selectedValues.includes(value)
    const pendingMouseUpSelectionRef = React.useRef(false)
    const itemNodeRef = React.useRef<any>(null)
    const [, rerenderRegistry] = React.useReducer((version) => version + 1, 0)
    const registrationRef = React.useRef<ReturnType<typeof registry.registerItem> | null>(
      null
    )
    const initialRegistration = React.useRef({
      value,
      disabled,
      textValue: textValueProp,
    })

    useIsomorphicLayoutEffect(
      () => registry.subscribe(() => rerenderRegistry()),
      [registry]
    )

    useIsomorphicLayoutEffect(() => {
      const registration = registry.registerItem(initialRegistration.current)
      registrationRef.current = registration
      const registeredNode = itemNodeRef.current
      registration.setNode(registeredNode)
      const registeredIndex = registry
        .getItems()
        .findIndex((item) => item.id === registration.id)
      if (
        isWeb &&
        listRef &&
        registeredIndex >= 0 &&
        registeredNode instanceof HTMLElement
      ) {
        listRef.current[registeredIndex] = registeredNode
      }
      return () => {
        const currentIndex = registry
          .getItems()
          .findIndex((item) => item.id === registration.id)
        if (
          listRef &&
          currentIndex >= 0 &&
          listRef.current[currentIndex] === registeredNode
        ) {
          listRef.current[currentIndex] = null
        }
        registrationRef.current = null
        registration.unregister()
      }
    }, [registry])

    useIsomorphicLayoutEffect(() => {
      registrationRef.current?.update({ value, disabled, textValue: textValueProp })
    }, [disabled, textValueProp, value])

    useIsomorphicLayoutEffect(() => {
      registrationRef.current?.setNode(itemNodeRef.current)
    })

    const index = registry.getIndex(value)

    React.useEffect(() => {
      const handleActiveIndex = (i: number) => {
        if (index === i) {
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
    }, [activeIndexRef, activeIndexSubscribe, index, listRef])

    const textId = React.useId()

    const refCallback = React.useCallback(
      (node) => {
        itemNodeRef.current = node
        registrationRef.current?.setNode(node)
        if (!isWeb) return
        if (listRef && index >= 0) {
          listRef.current[index] = node instanceof HTMLElement ? node : null
        }
      },
      [index, listRef]
    )

    const composedRefs = useComposedRefs(forwardedRef, refCallback)

    const handleSelect = React.useCallback(
      (event?: any, reason: 'item-press' | 'keyboard' = 'item-press') => {
        if (disabled) return
        const nativeEvent = event?.nativeEvent || event
        selectValue(
          value,
          createChangeEventDetails(
            reason,
            nativeEvent,
            event?.currentTarget
          ) as SelectValueChangeDetails
        )
      },
      [disabled, selectValue, value]
    )

    const handleKeyDown = React.useCallback(
      (event: any) => {
        if (disabled) return
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          handleSelect(event, 'keyboard')
          return
        }
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault()
          event.stopPropagation()
          moveActive(event.key === 'ArrowDown' ? 1 : -1, event.nativeEvent || event)
          return
        }
        if (
          !interactions &&
          event.key?.length === 1 &&
          !event.metaKey &&
          !event.ctrlKey
        ) {
          search(event.key, event.nativeEvent || event)
        }
        if (allowSelectRef) {
          allowSelectRef.current = true
        }
      },
      [allowSelectRef, disabled, handleSelect, interactions, moveActive, search]
    )

    const selectItemProps = React.useMemo(() => {
      if (interactions) {
        const {
          onTouchMove,
          onTouchEnd,
          onKeyDown,
          onClick,
          onMouseUp,
          onMouseMove,
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
          onMouseMove(event) {
            if (disabled || index < 0) return
            setActiveIndexFast?.(index, {
              reason: 'item-hover',
              event: event.nativeEvent || event,
              trigger: event.currentTarget,
              index,
            } as SelectActiveChangeDetails)
          },
          onKeyDown: handleKeyDown,
          onClick(event) {
            if (disabled) return
            const shouldSelect =
              pendingMouseUpSelectionRef.current || allowSelectRef!.current
            pendingMouseUpSelectionRef.current = false
            clearTimeout(selectTimeoutRef!.current)
            allowSelectRef!.current = true
            if (shouldSelect) {
              handleSelect(event)
            }
          },
          onMouseUp(event) {
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
                handleSelect(event)
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
          onMouseMove: composeEventHandlers(
            onMouseMove as any,
            interactionProps.onMouseMove
          ),
          onPress,
        }
      }

      return {
        ...restProps,
        onKeyDown: composeEventHandlers(restProps.onKeyDown as any, handleKeyDown),
        onMouseMove: composeEventHandlers(restProps.onMouseMove as any, (event: any) => {
          if (disabled || index < 0) return
          setActiveIndexFast?.(index, {
            reason: 'item-hover',
            event: event.nativeEvent || event,
            trigger: event.currentTarget,
            index,
          } as SelectActiveChangeDetails)
        }),
        onPress: composeEventHandlers(restProps.onPress as any, handleSelect),
      }
    }, [
      allowMouseUpRef,
      allowSelectRef,
      disabled,
      handleKeyDown,
      handleSelect,
      index,
      interactions,
      restProps,
      selectTimeoutRef,
      setActiveIndexFast,
    ])

    const accessibilityProps = getSelectOptionProps(
      mode,
      isSelected,
      disabled,
      isWeb ? 'web' : 'native'
    )

    return (
      <SelectItemContextProvider
        scope={scope}
        value={value}
        textId={textId || ''}
        textValue={textValueProp}
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
            aria-labelledby={textId}
            data-state={isSelected ? 'active' : 'inactive'}
            data-disabled={disabled ? '' : undefined}
            tabIndex={
              disabled
                ? undefined
                : isWeb && isAdapted
                  ? index === (selectContext.activeIndex ?? selectContext.selectedIndex)
                    ? 0
                    : -1
                  : -1
            }
            zIndex={100}
            {...selectItemProps}
            {...accessibilityProps}
          />
        )}
      </SelectItemContextProvider>
    )
  },
  {
    disableTheme: true,
  }
)
