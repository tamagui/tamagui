import type { Shorthands } from '../types';
/**
 * @deprecated use useProps instead
 */
export declare function getExpandedShorthands<A extends object>(props: A): Omit<A, keyof Shorthands>;
export declare function getExpandedShorthand(propKey: string, props: object): any;
//# sourceMappingURL=getExpandedShorthands.d.ts.map