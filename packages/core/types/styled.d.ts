import * as React from 'react';
import { MediaProps, PseudoProps, StaticComponent, StaticConfig, TamaguiConfig, Themes, Tokens } from './types';
export declare function styled<Props, ParentComponent extends StaticComponent | React.Component<any> = React.Component<Partial<Props>>, Variants extends GetVariants<GetProps<ParentComponent>> = GetVariants<GetProps<ParentComponent>>>(Component: ParentComponent, options?: GetProps<ParentComponent> & {
    variants?: Variants;
}, staticExtractionOptions?: StaticConfig): StaticComponent<keyof GetVariantProps<Variants> extends never ? Props extends Object ? Props : GetProps<ParentComponent> : Omit<Props extends Object ? Props : GetProps<ParentComponent>, keyof GetVariantProps<Variants>> & GetVariantProps<Variants> & MediaProps<GetVariantProps<Variants>> & PseudoProps<GetVariantProps<Variants>>, void, import("./types").StaticConfigParsed, any>;
export declare type GetProps<A> = A extends StaticComponent<infer Props> ? Props : A extends React.Component<infer Props> ? Props : A extends (props: infer Props) => any ? Props : {};
export declare type GetVariants<Props> = void | {
    [key: string]: {
        [key: string]: Partial<Props> | ((val: any, config: {
            tokens: TamaguiConfig['tokens'];
            theme: Themes extends {
                [key: string]: infer B;
            } ? B : unknown;
            props: Props;
        }) => Partial<Props>);
    };
};
export declare type GetVariantProps<Variants> = Variants extends void ? {} : {
    [Key in keyof Variants]?: keyof Variants[Key] extends `...${infer VariantSpread}` ? VariantSpread extends keyof Tokens ? keyof Tokens[VariantSpread] extends string | number ? `$${keyof Tokens[VariantSpread]}` | null : unknown : unknown : keyof Variants[Key] extends 'true' ? boolean | null : keyof Exclude<Variants[Key], undefined>;
};
//# sourceMappingURL=styled.d.ts.map