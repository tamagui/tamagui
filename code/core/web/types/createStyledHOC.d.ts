import { type ReactNode, type Ref as ReactRef } from 'react';
import type { GetFinalProps, StaticConfig, StyledHOCMergedProps, StyledHOCOptions, TamaguiComponent, TamaDefer } from './types';
export declare function createStyledHOC<Props, Ref, NonStyledProps, BaseStyles extends object, VariantProps, ParentStaticProperties, CustomProps extends object = {}>(component: {
    __tama: [Props, Ref, NonStyledProps, BaseStyles, VariantProps, ParentStaticProperties];
    staticConfig: StaticConfig;
}, render: (props: Omit<NoInfer<Props extends TamaDefer ? GetFinalProps<NonStyledProps, BaseStyles, VariantProps> : Props>, keyof CustomProps> & CustomProps, ref: ReactRef<NoInfer<Ref>> | null) => ReactNode, options?: StyledHOCOptions): TamaguiComponent<Props extends TamaDefer ? string extends keyof NonStyledProps ? StyledHOCMergedProps<GetFinalProps<NonStyledProps, BaseStyles, VariantProps>, CustomProps> : TamaDefer : StyledHOCMergedProps<Props, CustomProps>, Ref, StyledHOCMergedProps<NonStyledProps, CustomProps>, BaseStyles, keyof CustomProps extends never ? VariantProps : Omit<VariantProps, keyof CustomProps>, ParentStaticProperties>;
//# sourceMappingURL=createStyledHOC.d.ts.map