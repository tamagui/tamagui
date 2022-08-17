import React, {cloneElement, ReactElement} from 'react';
import {useServerRequest} from '../ServerRequestProvider/index.js';
import {matchPath} from '../../utilities/matchPath.js';
import {RouteParamsProvider} from '../useRouteParams/RouteParamsProvider.client.js';

export type RouteProps = {
  /** The URL path where the route exists. The path can contain variables. For example, `/products/:handle`. */
  path: string;
  /** A reference to a React Server Component that's rendered when the route is active. */
  page: ReactElement;
};

/**
 * The `Route` component is used to set up a route in Hydrogen that's independent of the file system. Routes are
 * matched in the order that they're defined.
 */
export function Route({path, page}: RouteProps): ReactElement | null {
  const request = useServerRequest();
  const {routeRendered, serverProps} = request.ctx.router;

  if (routeRendered) return null;

  if (path === '*') {
    request.ctx.router.routeRendered = true;
    return cloneElement(page, serverProps);
  }

  const match = matchPath(serverProps.pathname, {
    path,
    exact: true,
  });

  if (match) {
    request.ctx.router.routeRendered = true;
    request.ctx.router.routeParams = match.params;

    return (
      <RouteParamsProvider routeParams={match.params} basePath={'/'}>
        {cloneElement(page, {params: match.params || {}, ...serverProps})}
      </RouteParamsProvider>
    );
  }

  return null;
}
