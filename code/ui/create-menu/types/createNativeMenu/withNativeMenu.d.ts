type GetProps<T> = T extends React.ComponentType<infer P> ? P : {};
export declare function withNativeMenu<C extends React.ComponentType<any>, N extends React.ComponentType<any>>({ Component, NativeComponent, }: {
    Component: C;
    NativeComponent: N;
    scope?: string;
    isRoot?: boolean;
}): React.FC<GetProps<C> & GetProps<N>>;
export {};
//# sourceMappingURL=withNativeMenu.d.ts.map