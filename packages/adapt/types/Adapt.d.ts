/// <reference types="react" />
import { MediaQueryKey } from '@tamagui/core';
type MediaQueryKeyString = MediaQueryKey extends string ? MediaQueryKey : never;
export type AdaptProps = {
    when?: MediaQueryKeyString;
    platform?: 'native' | 'web' | 'touch';
    children?: any;
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
    Contents: AdaptParentContextI['Contents'];
}) => {
    AdaptProvider: (props: {
        children?: any;
    }) => JSX.Element;
    when: When;
};
export declare const Adapt: (({ platform, when, children }: AdaptProps) => any) & {
    Contents: {
        (props: any): import("react").FunctionComponentElement<any>;
        shouldForwardSpace: boolean;
    };
};
export {};
//# sourceMappingURL=Adapt.d.ts.map