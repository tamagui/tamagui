export declare function withNativeMenu<C extends React.ComponentType<any>, N extends React.ComponentType<any>>({ Component, NativeComponent, scope, isRoot, }: {
    Component: C;
    NativeComponent: N;
    scope: string;
    isRoot: boolean;
}): C | {
    (props: React.ComponentProps<C> & React.ComponentProps<N> & {
        native?: boolean;
    }): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
//# sourceMappingURL=withNativeMenu.d.ts.map