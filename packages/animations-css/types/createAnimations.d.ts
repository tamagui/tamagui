/// <reference types="react" />
import { AnimationDriver } from '@tamagui/web';
export declare function createAnimations<A extends Object>(animations: A): AnimationDriver<A>;
export declare function populateChildrenRefsAndPassDisableCssProp(children: any, refs: any): any;
export declare function LayoutAnimationGroup({ children }: {
    children: any;
}): JSX.Element;
export declare function useLayoutAnimationGroup(): {
    /** it's just to trigger re-render */
    trigger: boolean;
    toggle: () => void;
};
//# sourceMappingURL=createAnimations.d.ts.map