import React, { isValidElement } from 'react'

export function useSheetChildren(childrenProp: any) {
  let handleComponent: React.ReactElement | null = null
  let overlayComponent: React.ReactElement | null = null
  let frameComponent: React.ReactElement | null = null

  // TODO do more radix-like and don't require direct children descendents
  React.Children.forEach(childrenProp, (child) => {
    if (isValidElement(child)) {
      const name = child.type?.['staticConfig']?.componentName
      switch (name) {
        case 'SheetHandle':
          handleComponent = child
          break
        case 'Sheet':
          frameComponent = child
          break
        case 'SheetOverlay':
          overlayComponent = child
          break
        default:
          console.warn('Warning: passed invalid child to Sheet', child)
      }
    }
  })

  return {
    handleComponent,
    overlayComponent,
    frameComponent,
    bottomCoverComponent: frameComponent
      ? React.cloneElement(frameComponent, {
          children: null,
          position: 'absolute',
          bottom: -100,
          height: 110,
          left: 0,
          right: 0,
        })
      : null,
  }
}
