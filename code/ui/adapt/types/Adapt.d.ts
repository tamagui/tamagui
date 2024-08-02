import type { MediaQueryKey, UseMediaState } from '@tamagui/core';
type MediaQueryKeyString = MediaQueryKey extends string ? MediaQueryKey : never;
export type AdaptProps = {
    when?: MediaQueryKeyString | ((state: {
        media: UseMediaState;
    }) => boolean);
    platform?: 'native' | 'web' | 'touch' | 'ios' | 'android';
    children?: React.ReactNode | ((state: {
        enabled: boolean;
        media: UseMediaState;
    }) => React.ReactNode);
};
type When = MediaQueryKeyString | boolean | null;
type Component = (props: any) => any;
type AdaptParentContextI = {
    Contents: Component;
    setWhen: (when: When) => any;
};
export declare const AdaptParentContext: import("react").Context<AdaptParentContextI | null>;
export declare const AdaptContents: {
    (props: any): import("react").FunctionComponentElement<any>;
    shouldForwardSpace: boolean;
};
export declare const useAdaptParent: ({ Contents, }: {
    Contents: AdaptParentContextI["Contents"];
}) => {
    AdaptProvider: (props: {
        children?: any;
    }) => import("react/jsx-runtime").JSX.Element;
    when: When;
};
export declare const Adapt: (({ platform, when, children }: AdaptProps) => import("react").ReactNode) & {
    Contents: {
        (props: any): import("react").FunctionComponentElement<any>;
        shouldForwardSpace: boolean;
    };
};
export {};
//# sourceMappingURL=Adapt.d.ts.map