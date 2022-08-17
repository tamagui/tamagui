import React, { ReactElement } from 'react'

import { BrowserRouter } from './BrowserRouter.client.js'

type RouterProps = {
  /** Any React elements. */
  children: Array<ReactElement> | ReactElement
}

/**
 * The `Router` component provides the context for routing in your Hydrogen app.
 */
export function Router({ children }: RouterProps): ReactElement {
  return <BrowserRouter>{children}</BrowserRouter>
}
