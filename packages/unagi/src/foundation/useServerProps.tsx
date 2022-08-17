import { useContext } from 'react'

import {
  InternalServerPropsContextValue,
  ServerPropsContext,
  ServerPropsContextValue,
} from './ServerPropsProvider/ServerPropsProvider.js'

/**
 * The `useServerProps` hook allows you to manage the [server props](https://shopify.dev/custom-storefronts/hydrogen/framework/server-props) passed to your server components when using Hydrogen as a React Server Component framework. The server props get cleared when you navigate from one route to another.
 *
 * ## Return value
 *
 * The `useServerProps` hook returns an object with the following keys:
 *
 * | Key              | Description                                                                            |
 * | ---------------- | -------------------------------------------------------------------------------------- |
 * | `serverProps`    | The current server props.                                                              |
 * | `setServerProps` | A function used to modify server props.                                                |
 * | `pending`        | Whether a [transition is pending](https://github.com/reactwg/react-18/discussions/41). |
 *
 */
export function useServerProps(): ServerPropsContextValue {
  const internalServerPropsContext = useContext<InternalServerPropsContextValue>(ServerPropsContext)

  if (!internalServerPropsContext) {
    return {} as ServerPropsContextValue
  }

  return {
    serverProps: internalServerPropsContext.serverProps,
    setServerProps: internalServerPropsContext.setServerProps,
    pending: internalServerPropsContext.pending,
  }
}

/**
 * Internal-only hook to manage server state, including to set location server state
 * @internal
 */
export function useInternalServerProps(): InternalServerPropsContextValue {
  return (
    useContext<InternalServerPropsContextValue>(ServerPropsContext) ??
    ({} as InternalServerPropsContextValue)
  )
}
