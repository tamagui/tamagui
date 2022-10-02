/**
 * This effect should be at your root, so React finishes it "last"
 */
export declare function useSetupHasSSRRendered(): void;
export declare function useDidFinishSSR(props?: {
    /**
     * Disable wrapping update in `startTransition`
     */
    disableTransition?: boolean;
    /**
     * Notice: don't change this value, it changes the hook type to useLayoutEffect
     */
    effectType?: 'layout';
}): boolean | undefined;
//# sourceMappingURL=index.d.ts.map