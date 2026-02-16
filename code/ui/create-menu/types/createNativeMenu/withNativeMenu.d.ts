type GetProps<T> = T extends React.ComponentType<infer P> ? P : never;
export declare function withNativeMenu<C extends React.ComponentType<any>, N extends React.ComponentType<any>, CP = GetProps<C>, NP = GetProps<N>>({ Component, NativeComponent, }: {
    Component: C;
    NativeComponent: N;
    scope?: string;
    isRoot?: boolean;
}): React.FC<CP & Partial<Omit<NP, keyof CP>>>;
export {};
//# sourceMappingURL=withNativeMenu.d.ts.map