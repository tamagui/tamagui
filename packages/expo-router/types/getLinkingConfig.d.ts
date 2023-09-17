import { LinkingOptions } from '@react-navigation/native';
import { Screen } from './getReactNavigationConfig';
import { getPathFromState } from './link/linking';
import { RouteNode } from './Route';
export declare function getNavigationConfig(routes: RouteNode): {
    initialRouteName?: string;
    screens: Record<string, Screen>;
};
export type ExpoLinkingOptions = LinkingOptions<object> & {
    getPathFromState?: typeof getPathFromState;
};
export declare function getLinkingConfig(routes: RouteNode): ExpoLinkingOptions;
export declare const stateCache: Map<string, any>;
//# sourceMappingURL=getLinkingConfig.d.ts.map