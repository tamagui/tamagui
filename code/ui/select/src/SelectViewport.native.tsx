import { AdaptContext, AdaptPortalContents, useAdaptContext } from '@tamagui/adapt'
import { createStyledHOC, styled, Theme, useThemeName, View } from '@tamagui/core'

import { VIEWPORT_NAME } from './constants'
import {
  ForwardSelectContext,
  useSelectContext,
  useSelectItemParentContext,
} from './context'
import type { SelectViewportExtraProps, SelectViewportProps } from './types'

export const SelectViewportFrame = styled(View, {
  name: VIEWPORT_NAME,
  position: 'relative',
})

export const SelectViewport = createStyledHOC(
  SelectViewportFrame
)<SelectViewportExtraProps>(function SelectViewport(
  props: SelectViewportProps,
  forwardedRef
) {
  const { scope, children, disableScroll: _disableScroll, ...viewportProps } = props
  const context = useSelectContext(scope)
  const itemParentContext = useSelectItemParentContext(scope)
  const themeName = useThemeName()
  const adaptContext = useAdaptContext()

  const contents = (
    <Theme name={themeName}>
      <ForwardSelectContext itemContext={itemParentContext} context={context}>
        <AdaptContext.Provider {...adaptContext}>
          <SelectViewportFrame {...viewportProps} ref={forwardedRef}>
            {children}
          </SelectViewportFrame>
        </AdaptContext.Provider>
      </ForwardSelectContext>
    </Theme>
  )

  if (!context.open) {
    if (context.lazyMount && context.renderValue) return null
    return <SelectViewportFrame display="none">{contents}</SelectViewportFrame>
  }

  return <AdaptPortalContents scope={context.adaptScope}>{contents}</AdaptPortalContents>
})

SelectViewport.displayName = VIEWPORT_NAME
