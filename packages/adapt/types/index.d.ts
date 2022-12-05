/// <reference types="react" />
import { MediaQueryKey } from '@tamagui/core';
export declare type AdaptProps = {
    when?: MediaQueryKey;
    platform?: 'native' | 'web' | 'touch';
    children?: any;
};
declare type Component = (props: any) => any;
declare type AdaptParentContextI = {
    Contents: Component;
    setWhen: (when: MediaQueryKey) => any;
};
export declare const AdaptContents: () => import("react").FunctionComponentElement<any>;
export declare const useAdaptParent: ({ Contents }: {
    Contents: AdaptParentContextI['Contents'];
}) => {
    AdaptProvider: (props: {
        children?: any;
    }) => JSX.Element;
    when: string | number | null;
};
export declare const Adapt: (({ platform, when, children }: AdaptProps) => any) & {
    Contents: () => import("react").FunctionComponentElement<any>;
};
export {};
//# sourceMappingURL=index.d.ts.map