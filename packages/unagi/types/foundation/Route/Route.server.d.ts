import { ReactElement } from 'react';
export declare type RouteProps = {
    /** The URL path where the route exists. The path can contain variables. For example, `/products/:handle`. */
    path: string;
    /** A reference to a React Server Component that's rendered when the route is active. */
    page: ReactElement;
};
/**
 * The `Route` component is used to set up a route in Hydrogen that's independent of the file system. Routes are
 * matched in the order that they're defined.
 */
export declare function Route({ path, page }: RouteProps): ReactElement | null;
//# sourceMappingURL=Route.server.d.ts.map