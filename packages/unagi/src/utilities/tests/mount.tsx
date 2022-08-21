import { createMount } from '@shopify/react-testing'
import { BrowserHistory } from 'history'
import React from 'react'

import { BrowserRouter } from '../../foundation/Router/BrowserRouter.client.jsx'
import {
  LocationServerProps,
  ServerProps,
  ServerPropsProvider,
} from '../../foundation/ServerPropsProvider/ServerPropsProvider.jsx'

type SetServerProps = React.Dispatch<React.SetStateAction<ServerProps>>
export interface ShopifyProviderOptions {
  setServerProps?: SetServerProps
  serverProps?: LocationServerProps
  history?: BrowserHistory
}

export interface ShopifyProviderContext {
  setServerProps: SetServerProps
  serverProps: LocationServerProps
  history?: BrowserHistory
}

export const mountWithProviders = createMount<ShopifyProviderOptions, ShopifyProviderContext>({
  context: (options) => ({
    setServerProps: options.setServerProps || ((() => {}) as SetServerProps),
    serverProps: options.serverProps || { pathname: '', search: '' },
    history: options.history,
  }),
  render: (element, { setServerProps, serverProps, history }) => (
    <ServerPropsProvider
      setServerPropsForRsc={setServerProps}
      initialServerProps={serverProps}
      setRscResponseFromApiRoute={() => {}}
    >
      <BrowserRouter history={history}>{element}</BrowserRouter>
    </ServerPropsProvider>
  ),
})
