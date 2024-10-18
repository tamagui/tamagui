import { AdaptParentContext, AdaptPortalContents } from '@tamagui/adapt'
import { Theme, useThemeName } from '@tamagui/core'
import * as React from 'react'

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
  const adaptContext = React.useContext(AdaptParentContext)

  // need to forward context...
  return (
    <AdaptPortalContents>
      <Theme name={themeName}>
        <ForwardSelectContext
          __scopeSelect={__scopeSelect}
          itemContext={itemParentContext}
          context={context}
        >
          <AdaptParentContext.Provider value={adaptContext}>
            {children}
          </AdaptParentContext.Provider>
        </ForwardSelectContext>
      </Theme>
    </AdaptPortalContents>
  )
}

SelectViewport.displayName = VIEWPORT_NAME
