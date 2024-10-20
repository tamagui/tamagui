import { AdaptContext, AdaptPortalContents, useAdaptContext } from '@tamagui/adapt'
import { Theme, useThemeName } from '@tamagui/core'

import { VIEWPORT_NAME } from './constants'
import {
  ForwardSelectContext,
  useSelectContext,
  useSelectItemParentContext,
} from './context'
import type { SelectScopedProps, SelectViewportProps } from './types'

export const SelectViewport = (props: SelectScopedProps<SelectViewportProps>) => {
  const { __scopeSelect, children } = props
  const context = useSelectContext(VIEWPORT_NAME, __scopeSelect)
  const itemParentContext = useSelectItemParentContext(VIEWPORT_NAME, __scopeSelect)
  const themeName = useThemeName()

  // re-propogate context...
  const adaptContext = useAdaptContext()

  return (
    <AdaptPortalContents>
      <Theme name={themeName}>
        <ForwardSelectContext
          __scopeSelect={__scopeSelect}
          itemContext={itemParentContext}
          context={context}
        >
          <AdaptContext.Provider {...adaptContext}>{children}</AdaptContext.Provider>
        </ForwardSelectContext>
      </Theme>
    </AdaptPortalContents>
  )
}

SelectViewport.displayName = VIEWPORT_NAME
