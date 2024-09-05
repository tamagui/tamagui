export declare function withNativeMenu<C extends React.ComponentType<any>, N extends React.ComponentType<any>>({ Component, NativeComponent, useNativeProp, useNativePropScope, isRoot, }: {
    Component: C;
    NativeComponent: N;
    useNativeProp: (scope: string) => {
        native: boolean;
    };
    useNativePropScope: string;
    isRoot: boolean;
}): C | {
    (props: React.ComponentProps<C> & React.ComponentProps<N> & {
        native?: boolean;
    }): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
//# sourceMappingURL=withNativeMenu.d.ts.map