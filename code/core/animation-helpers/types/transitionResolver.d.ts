import type { ResolvedTransition } from "./resolveTransition";
/**
* `getSplitStyles` needs to know whether a `transition` string is plain css or
* needs a driver, and that answer has to come from the same grammar the
* compiler uses. Importing the grammar into `@tamagui/web` would put the
* parser and the spring solver in every bundle, including one with no
* animations in it at all, which is about 3.6kb gzip of runtime nobody asked
* for.
*
* So `resolveTransition` registers itself here on import. Loading any driver
* loads it, and a bundle with no driver in it has no presets to resolve, so
* the absent resolver is the correct answer rather than a missing one.
*/
export type TransitionResolver = {
	resolve: (value: any, options: {
		animations?: any;
	}) => ResolvedTransition;
	toCSS: (resolved: ResolvedTransition) => string | undefined;
};
export declare function setTransitionResolver(next: TransitionResolver): void;
export declare function getTransitionResolver(): TransitionResolver | null;

//# sourceMappingURL=transitionResolver.d.ts.map