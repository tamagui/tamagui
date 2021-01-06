import React from 'react'

import { StackProps, VStack } from './Stacks'

export type BlurViewProps = {
  blurAmount?: number // 0 - 100
  blurRadius?: number
  fallbackBackgroundColor?: string
  blurType?:
    | 'xlight'
    | 'light'
    | 'dark'
    // iOS 13+ only
    | 'chromeMaterial'
    | 'material'
    | 'thickMaterial'
    | 'thinMaterial'
    | 'ultraThinMaterial'
    | 'chromeMaterialDark'
    | 'materialDark'
    | 'thickMaterialDark'
    | 'thinMaterialDark'
    | 'ultraThinMaterialDark'
    | 'chromeMaterialLight'
    | 'materialLight'
    | 'thickMaterialLight'
    | 'thinMaterialLight'
    | 'ultraThinMaterialLight'
    // tvOS and iOS 10+ only
    | 'regular'
    | 'prominent'
    // tvOS only
    | 'extraDark'
  downsampleFactor?: number
} & StackProps

export function BlurView({
  children,
  borderRadius,
  fallbackBackgroundColor,
  blurRadius = 20,
  ...props
}: BlurViewProps) {
  return (
    <VStack borderRadius={borderRadius} {...props}>
      <div
        // fallback for safari but non customizable
        className="backdrop-filter"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backdropFilter: `blur(${blurRadius}px)`,
          borderRadius,
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />
      {children}
    </VStack>
  )
}
