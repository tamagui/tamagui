import React from 'react'

import { StackProps, VStack } from './Stacks'

export type BlurViewProps = StackProps & {
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
  blurAmount?: number // 0 - 100
  blurRadius?: number
  downsampleFactor?: number
}

export function BlurView({
  children,
  borderRadius,
  fallbackBackgroundColor,
  ...props
}: BlurViewProps) {
  return (
    <VStack
      borderRadius={borderRadius}
      backgroundColor={fallbackBackgroundColor}
      {...props}
    >
      <div
        className="backdrop-filter"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backdropFilter: 'blur(20px)',
          borderRadius,
        }}
      >
        {children}
      </div>
    </VStack>
  )
}
