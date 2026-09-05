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
import { useSelectItemParentContext } from './context'
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
  disabled?: boolean
  textValue?: string
}

export interface SelectItemProps
  extends
    Omit<GetProps<typeof SelectItemFrame>, keyof SelectItemExtraProps>,
    SelectItemExtraProps {}

export const SelectItemFrame = styled(View, {
  displayName: ITEM_NAME,
  alignItems: 'center',
  flexDirection: 'row',
})

export const SelectItem = createStyledHOC(
  SelectItemFrame,
  function SelectItem(props: SelectScopedProps<SelectItemProps>, forwardedRef) {
    const {
      scope,
      value,
      disabled: disabledProp,
      'aria-disabled': ariaDisabled,
      textValue: textValueProp,
      ...restProps
    } = props
    const disabled = disabledProp ?? ariaDisabled === true

    // items read only the item parent context: the select context carries
    // viewport state (position, scroll arrows) that must not re-render the list
    const context = useSelectItemParentContext(scope)
    const isAdapted = useAdaptIsActive(context.adaptScope)

    const {
      registry,
      mode,
      selectedValues,
      selectValue,
      activeIndexSubscribe,
      activeIndexRef,
      allowMouseUpRef,
      allowSelectRef,
      selectTimeoutRef,
      getItemProps,
      shouldRenderWebNative,
      setActiveIndex,
      lastPointerRef,
      moveActive,
      search,
    } = context

    const isSelected = selectedValues.includes(value)
    const pendingMouseUpSelectionRef = React.useRef(false)
    const itemNodeRef = React.useRef<any>(null)
    const registrationRef = React.useRef<ReturnType<typeof registry.registerItem> | null>(
      null
    )
    const initialRegistration = React.useRef({
      value,
      disabled,
      textValue: textValueProp,
    })

    // the item never subscribes to the registry: its index is read at event
    // time, and the owner mirrors the registry's nodes into the list ref
    useIsomorphicLayoutEffect(() => {
      const registration = registry.registerItem(initialRegistration.current)
      registrationRef.current = registration
      registration.setNode(itemNodeRef.current)
      return () => {
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

    // the only per-item state: this item is the active one. the active index
    // itself is a ref plus an emitter, so a hover re-renders two items, not the list
    const [isActive, setIsActive] = React.useState(false)
    // every item hears every change; only the two whose state flips may set
    // it, since a same-value set still renders once when updates are queued
    const isActiveRef = React.useRef(false)

    React.useEffect(() => {
      const handleActiveIndex = (i: number | null) => {
        const next = i != null && registry.getIndex(value) === i
        if (next !== isActiveRef.current) {
          isActiveRef.current = next
          setIsActive(next)
        }
        if (next && isWeb) {
          // use rAF to focus after browser's click handling completes
          // this prevents the trigger from stealing focus after we set it
          requestAnimationFrame(() => {
            itemNodeRef.current?.focus?.()
          })
        }
      }

      // the parent effect may have set it before we subscribed
      handleActiveIndex(activeIndexRef?.current ?? null)

      return activeIndexSubscribe(handleActiveIndex)
    }, [activeIndexRef, activeIndexSubscribe, registry, value])

    const textId = React.useId()

    const refCallback = React.useCallback((node) => {
      itemNodeRef.current = node
      registrationRef.current?.setNode(node)
    }, [])

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

    const handleMouseMove = React.useCallback(
      (event: any) => {
        if (disabled) return
        const index = registry.getIndex(value)
        if (index < 0) return
        const last = lastPointerRef.current
        if (event.clientX === last.x && event.clientY === last.y) return
        last.x = event.clientX
        last.y = event.clientY
        setActiveIndex(index, {
          reason: 'item-hover',
          event: event.nativeEvent || event,
          trigger: event.currentTarget,
          index,
        } as SelectActiveChangeDetails)
      },
      [disabled, lastPointerRef, registry, setActiveIndex, value]
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
          !getItemProps &&
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
      [allowSelectRef, disabled, handleSelect, getItemProps, moveActive, search]
    )

    const selectItemProps = React.useMemo(() => {
      if (getItemProps) {
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
        const interactionProps = getItemProps({
          ...itemProps,
          onTouchMove() {
            allowSelectRef!.current = true
            allowMouseUpRef!.current = false
          },
          onTouchEnd() {
            allowSelectRef!.current = false
            allowMouseUpRef!.current = true
          },
          onMouseMove: handleMouseMove,
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
        onMouseMove: composeEventHandlers(restProps.onMouseMove as any, handleMouseMove),
        onPress: composeEventHandlers(restProps.onPress as any, handleSelect),
      }
    }, [
      allowMouseUpRef,
      allowSelectRef,
      disabled,
      handleKeyDown,
      handleMouseMove,
      handleSelect,
      getItemProps,
      restProps,
      selectTimeoutRef,
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
                : isWeb &&
                    isAdapted &&
                    (isActive || (activeIndexRef?.current == null && isSelected))
                  ? 0
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
