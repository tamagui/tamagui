type CombinedProps<C, N> = C extends React.ComponentType<infer CP> ? N extends React.ComponentType<infer NP> ? CP & NP : CP : N extends React.ComponentType<infer NP> ? NP : {};
export declare function withNativeMenu<C extends React.ComponentType<any>, N extends React.ComponentType<any>>({ Component, NativeComponent, }: {
    Component: C;
    NativeComponent: N;
    scope?: string;
    isRoot?: boolean;
}): React.FC<CombinedProps<C, N>>;
export {};
//# sourceMappingURL=withNativeMenu.d.ts.map