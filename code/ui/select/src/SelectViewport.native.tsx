import { AdaptContext, AdaptPortalContents, useAdaptContext } from '@tamagui/adapt'
import { Theme, useThemeName } from '@tamagui/core'
import { YStack } from '@tamagui/stacks'

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

  // re-propagate context
  const adaptContext = useAdaptContext()
  const contents = (
    <Theme name={themeName}>
      <ForwardSelectContext itemContext={itemParentContext} context={context}>
        <AdaptContext.Provider {...adaptContext}>{children}</AdaptContext.Provider>
      </ForwardSelectContext>
    </Theme>
  )

  if (!context.open) {
    if (context.lazyMount && context.renderValue) {
      return null
    }

    return <YStack display="none">{contents}</YStack>
  }

  return <AdaptPortalContents scope={context.adaptScope}>{contents}</AdaptPortalContents>
}

SelectViewport.displayName = VIEWPORT_NAME
