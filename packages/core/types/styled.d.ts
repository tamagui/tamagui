import { GetProps, GetVariantProps, MediaProps, PseudoProps, StackProps, StaticComponent, StaticConfig, StylableComponent, VariantDefinitions } from './types';
export declare function styled<ParentComponent extends StylableComponent = StaticComponent<StackProps>, Variants extends VariantDefinitions<any> | symbol = VariantDefinitions<any> | symbol>(Component: ParentComponent, options?: GetProps<ParentComponent> & {
    name?: string;
    variants?: Variants | undefined;
    defaultVariants?: Variants extends Object ? GetVariantProps<Variants> : never;
}, staticExtractionOptions?: StaticConfig): StaticComponent<Variants extends symbol | undefined ? GetProps<ParentComponent> : Omit<GetProps<ParentComponent> extends Object ? GetProps<ParentComponent> : {}, `$${string}` | keyof PseudoProps<any> | ((Variants extends symbol ? never : keyof Variants[keyof Variants]) extends never ? 1234556123312321 : Variants extends symbol ? never : keyof Variants[keyof Variants])> & (Variants extends symbol ? {} : Expand<GetVariantProps<Variants>>) & MediaProps<(Variants extends symbol ? {} : Expand<GetVariantProps<Variants>>) & ((Variants extends symbol ? never : keyof Variants[keyof Variants]) extends never ? GetProps<ParentComponent> : Omit<GetProps<ParentComponent>, Variants extends symbol ? never : keyof Variants[keyof Variants]>)> & PseudoProps<(Variants extends symbol ? {} : Expand<GetVariantProps<Variants>>) & ((Variants extends symbol ? never : keyof Variants[keyof Variants]) extends never ? GetProps<ParentComponent> : Omit<GetProps<ParentComponent>, Variants extends symbol ? never : keyof Variants[keyof Variants]>)>, Variants extends symbol ? {} : Expand<GetVariantProps<Variants>>, any, import("./types").StaticConfigParsed>;
declare type Expand<T> = T extends infer O ? {
    [K in keyof O]?: O[K];
} : never;
export {};
//# sourceMappingURL=styled.d.ts.map