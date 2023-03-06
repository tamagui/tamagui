import { isContext } from 'vm'

import { createCollection } from '@tamagui/collection'
import { TamaguiElement, useId } from '@tamagui/core'
import type { Scope } from '@tamagui/create-context'
import { createContextScope } from '@tamagui/create-context'
import { PortalProvider } from '@tamagui/portal'
import * as React from 'react'

import { ToastViewport } from './Viewport'

/* -------------------------------------------------------------------------------------------------
 * ToastProvider
 * -----------------------------------------------------------------------------------------------*/

const PROVIDER_NAME = 'ToastProvider'

const [Collection, useCollection, createCollectionScope] =
  createCollection<TamaguiElement>('Toast')

type SwipeDirection = 'up' | 'down' | 'left' | 'right'
type ToastProviderContextValue = {
  id: string
  label: string
  duration: number
  swipeDirection: SwipeDirection
  swipeThreshold: number
  toastCount: number
  viewport: TamaguiElement | null
  onViewportChange(viewport: TamaguiElement): void
  onToastAdd(): void
  onToastRemove(): void
  isFocusedToastEscapeKeyDownRef: React.MutableRefObject<boolean>
  isClosePausedRef: React.MutableRefObject<boolean>
}

type ScopedProps<P> = P & { __scopeToast?: Scope }
const [createToastContext, createToastScope] = createContextScope('Toast', [
  createCollectionScope,
])
const [ToastProviderProvider, useToastProviderContext] =
  createToastContext<ToastProviderContextValue>(PROVIDER_NAME)

interface ToastProviderProps {
  children?: React.ReactNode
  /**
   * An author-localized label for each toast. Used to help screen reader users
   * associate the interruption with a toast.
   * @defaultValue 'Notification'
   */
  label?: string
  /**
   * Time in milliseconds that each toast should remain visible for.
   * @defaultValue 5000
   */
  duration?: number
  /**
   * Direction of pointer swipe that should close the toast.
   * @defaultValue 'right'
   */
  swipeDirection?: SwipeDirection
  /**
   * Distance in pixels that the swipe must pass before a close is triggered.
   * @defaultValue 50
   */
  swipeThreshold?: number
  /**
   * @defaultValue unique generated identifier
   */
  id?: string
  /**
   * If on, will add default viewports with names: default, top, topleft, topright, bottom, bottomleft, bottomright
   */
  shouldAddDefaultViewports?: boolean
}

const ToastProvider: React.FC<ToastProviderProps> = (
  props: ScopedProps<ToastProviderProps>
) => {
  const {
    __scopeToast,
    id: providedId,
    label = 'Notification',
    duration = 5000,
    swipeDirection = 'right',
    swipeThreshold = 50,
    shouldAddDefaultViewports = false,
    children,
  } = props
  const id = providedId ?? useId()
  const [viewport, setViewport] = React.useState<TamaguiElement | null>(null)
  const [toastCount, setToastCount] = React.useState(0)
  const isFocusedToastEscapeKeyDownRef = React.useRef(false)
  const isClosePausedRef = React.useRef(false)

  return (
    <PortalProvider shouldAddRootHost={false} rootHostName="default">
      <Collection.Provider scope={__scopeToast}>
        <ToastProviderProvider
          scope={__scopeToast}
          id={id}
          label={label}
          duration={duration}
          swipeDirection={swipeDirection}
          swipeThreshold={swipeThreshold}
          toastCount={toastCount}
          viewport={viewport}
          onViewportChange={setViewport}
          onToastAdd={React.useCallback(() => {
            setToastCount((prevCount) => prevCount + 1)
          }, [])}
          onToastRemove={React.useCallback(() => {
            setToastCount((prevCount) => prevCount - 1)
          }, [])}
          isFocusedToastEscapeKeyDownRef={isFocusedToastEscapeKeyDownRef}
          isClosePausedRef={isClosePausedRef}
        >
          {children}

          {shouldAddDefaultViewports && (
            <>
              <ToastViewport
                flexDirection="column-reverse"
                name="default"
                top={0}
                left={0}
                right={0}
                marginHorizontal="auto"
              />
              <ToastViewport
                flexDirection="column-reverse"
                name="topleft"
                top={0}
                left={0}
              />
              <ToastViewport
                flexDirection="column-reverse"
                name="top"
                top={0}
                left={0}
                right={0}
                marginHorizontal="auto"
              />
              <ToastViewport
                flexDirection="column-reverse"
                name="topright"
                top={0}
                right={0}
              />
              <ToastViewport name="bottomleft" bottom={0} left={0} />
              <ToastViewport
                name="bottom"
                bottom={0}
                left={0}
                right={0}
                marginHorizontal="auto"
              />
              <ToastViewport name="bottomright" bottom={0} right={0} />
            </>
          )}
        </ToastProviderProvider>
      </Collection.Provider>
    </PortalProvider>
  )
}

ToastProvider.propTypes = {
  label(props) {
    if (props.label && typeof props.label === 'string' && !props.label.trim()) {
      const error = `Invalid prop \`label\` supplied to \`${PROVIDER_NAME}\`. Expected non-empty \`string\`.`
      return new Error(error)
    }
    return null
  },
}

ToastProvider.displayName = PROVIDER_NAME

export {
  ToastProvider,
  useToastProviderContext,
  Collection,
  useCollection,
  createToastScope,
  createToastContext,
}
export type { ScopedProps, ToastProviderProps, SwipeDirection }
