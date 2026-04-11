import React from 'react'
import { View, type ViewProps } from 'react-native'
import {
  claimExternalPressOwnership,
  releaseExternalPressOwnership,
  type ExternalPressOwnershipToken,
} from './gestureState'

export interface PressBoundaryProps extends ViewProps {
  enabled?: boolean
  /**
   * Alias for enabling the boundary. The behavior is limited to Tamagui's
   * shared press ownership and does not patch arbitrary RN bubbling.
   */
  stopPropagation?: boolean
  debugName?: string | null
}

function composeFirst<T extends (...args: any[]) => void>(ours: T, theirs?: T) {
  return (...args: Parameters<T>) => {
    ours(...args)
    theirs?.(...args)
  }
}

function composeLast<T extends (...args: any[]) => void>(theirs: T | undefined, ours: T) {
  return (...args: Parameters<T>) => {
    theirs?.(...args)
    ours(...args)
  }
}

export const PressBoundary: React.ForwardRefExoticComponent<
  PressBoundaryProps & React.RefAttributes<View>
> = React.forwardRef<View, PressBoundaryProps>(function PressBoundary(
  {
    enabled,
    stopPropagation,
    debugName,
    onTouchStart,
    onTouchEnd,
    onTouchCancel,
    onResponderGrant,
    onResponderRelease,
    onResponderTerminate,
    ...props
  },
  forwardedRef
) {
  const tokenRef = React.useRef<ExternalPressOwnershipToken | null>(null)
  const isEnabled = enabled ?? stopPropagation ?? true

  const claim = React.useCallback((): void => {
    if (!isEnabled) return
    if (tokenRef.current) {
      releaseExternalPressOwnership(tokenRef.current, debugName)
    }
    tokenRef.current = claimExternalPressOwnership(debugName)
  }, [debugName, isEnabled])

  const release = React.useCallback((): void => {
    if (!tokenRef.current) return
    releaseExternalPressOwnership(tokenRef.current, debugName)
    tokenRef.current = null
  }, [debugName])

  React.useEffect(() => release, [release])

  return (
    <View
      ref={forwardedRef}
      {...props}
      onTouchStart={composeFirst(claim, onTouchStart)}
      onTouchEnd={composeLast(onTouchEnd, release)}
      onTouchCancel={composeLast(onTouchCancel, release)}
      onResponderGrant={composeFirst(claim, onResponderGrant)}
      onResponderRelease={composeLast(onResponderRelease, release)}
      onResponderTerminate={composeLast(onResponderTerminate, release)}
    />
  )
})
