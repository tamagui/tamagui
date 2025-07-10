import { AdaptContext, AdaptPortalContents, useAdaptContext } from '@tamagui/adapt'
import { Theme, useThemeName } from '@tamagui/core'

import { VIEWPORT_NAME } from './constants'
import {
  ForwardSelectContext,
  useSelectContext,
  useSelectItemParentContext,
} from './context'
import type { SelectViewportProps } from './types'

export const SelectViewport = (props: SelectViewportProps) => {
  const { scope, children } = props
  const context = useSelectContext(scope)
  const itemParentContext = useSelectItemParentContext(scope)
  const themeName = useThemeName()

  // re-propogate context...
  const adaptContext = useAdaptContext()

  return (
    <AdaptPortalContents scope={context.adaptScope}>
      <Theme name={themeName}>
        <ForwardSelectContext itemContext={itemParentContext} context={context}>
          <AdaptContext.Provider {...adaptContext}>{children}</AdaptContext.Provider>
        </ForwardSelectContext>
      </Theme>
    </AdaptPortalContents>
  )
}

SelectViewport.displayName = VIEWPORT_NAME
