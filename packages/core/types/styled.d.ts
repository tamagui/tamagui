import React from 'react';
import { MediaProps, StaticComponent, StaticConfig, TamaguiConfig, Themes, Tokens } from './types';
export declare function styled<ParentComponent extends StaticComponent | React.Component<any>, Variants extends GetVariants<ParentComponent>>(Component: ParentComponent, options?: GetProps<ParentComponent> & {
    variants?: Variants;
}, staticExtractionOptions?: StaticConfig): StaticComponent<Omit<GetProps<ParentComponent>, keyof GetVariantProps<Variants>> & GetVariantProps<Variants> & MediaProps<GetVariantProps<Variants>>, any, import("./types").StaticConfigParsed, any>;
export declare type GetProps<A> = A extends StaticComponent<infer Props> ? Props : A extends React.Component<infer Props> ? Props : {};
export declare type GetVariants<ParentComponent extends StaticComponent | React.Component<any>> = void | {
    [key: string]: {
        [key: string]: Partial<GetProps<ParentComponent>> | ((val: any, config: {
            tokens: TamaguiConfig['tokens'];
            theme: Themes extends {
                [key: string]: infer B;
            } ? B : unknown;
            props: GetProps<ParentComponent>;
        }) => Partial<GetProps<ParentComponent>>);
    };
};
export declare type GetVariantProps<Variants> = Variants extends void ? {} : {
    [Key in keyof Variants]?: keyof Variants[Key] extends `...${infer VariantSpread}` ? VariantSpread extends keyof Tokens ? keyof Tokens[VariantSpread] extends string | number ? `$${keyof Tokens[VariantSpread]}` : unknown : unknown : keyof Variants[Key] extends 'true' ? boolean : keyof Exclude<Variants[Key], undefined>;
};
//# sourceMappingURL=styled.d.ts.map