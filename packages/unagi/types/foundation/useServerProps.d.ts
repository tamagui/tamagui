import { InternalServerPropsContextValue, ServerPropsContextValue } from './ServerPropsProvider/ServerPropsProvider.js';
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
export declare function useServerProps(): ServerPropsContextValue;
/**
 * Internal-only hook to manage server state, including to set location server state
 * @internal
 */
export declare function useInternalServerProps(): InternalServerPropsContextValue;
//# sourceMappingURL=useServerProps.d.ts.map