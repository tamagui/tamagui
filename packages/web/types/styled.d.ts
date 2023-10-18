import { StyledContext } from './helpers/createStyledContext';
import type { GetRef } from './interfaces/GetRef';
import type { GetProps, GetVariantValues, MediaProps, PseudoProps, StaticConfig, StylableComponent, TamaguiComponent, VariantDefinitions, VariantSpreadFunction } from './types';
type GetBaseProps<A extends StylableComponent> = A extends TamaguiComponent<any, any, infer P> ? P : GetProps<A>;
type GetVariantProps<A extends StylableComponent> = A extends TamaguiComponent<any, any, any, infer V> ? V : {};
type GetVariantAcceptedValues<V> = V extends Object ? {
    [Key in keyof V]?: V[Key] extends VariantSpreadFunction<any, infer Val> ? Val : GetVariantValues<keyof V[Key]>;
} : undefined;
type NullVariantAutocomplete = VariantDefinitions<any, any, '_no_'>;
export declare function styled<ParentComponent extends StylableComponent, Variants extends VariantDefinitions<ParentComponent> | NullVariantAutocomplete = ParentComponent extends TamaguiComponent<any, any, any, infer V> ? V extends void ? NullVariantAutocomplete : VariantDefinitions<ParentComponent> : NullVariantAutocomplete>(ComponentIn: ParentComponent, options?: GetProps<ParentComponent> & {
    name?: string;
    variants?: Variants | undefined;
    defaultVariants?: GetVariantAcceptedValues<Variants>;
    context?: StyledContext;
    acceptsClassName?: boolean;
}, staticExtractionOptions?: Partial<StaticConfig>): TamaguiComponent<Variants extends void ? GetProps<ParentComponent> : GetBaseProps<ParentComponent> & (Variants extends {
    [propName: string]: VariantSpreadFunction<any, "_no_"> | ({
        "...fontSize"?: import("./types").FontSizeVariantSpreadFunction<any> | undefined;
        "...fontStyle"?: import("./types").FontStyleVariantSpreadFunction<any> | undefined;
        "...fontTransform"?: import("./types").FontTransformVariantSpreadFunction<any> | undefined;
        "...lineHeight"?: import("./types").FontLineHeightVariantSpreadFunction<any> | undefined;
        "...letterSpacing"?: import("./types").FontLetterSpacingVariantSpreadFunction<any> | undefined;
        "...size"?: import("./types").SizeVariantSpreadFunction<any> | undefined;
        "...space"?: import("./types").SpaceVariantSpreadFunction<any> | undefined;
        "...color"?: import("./types").ColorVariantSpreadFunction<any> | undefined;
        "...zIndex"?: import("./types").ZIndexVariantSpreadFunction<any> | undefined;
        "...theme"?: import("./types").ThemeVariantSpreadFunction<any> | undefined;
        "...radius"?: import("./types").RadiusVariantSpreadFunction<any> | undefined;
    } & {
        [x: string]: any;
        [x: number]: any;
    } & {
        ":string"?: VariantSpreadFunction<any, string> | undefined;
        ":boolean"?: VariantSpreadFunction<any, boolean> | undefined;
        ":number"?: VariantSpreadFunction<any, number> | undefined;
    });
} ? GetVariantProps<ParentComponent> : { [Key in keyof GetVariantProps<ParentComponent> | keyof (Variants extends void ? {} : GetVariantAcceptedValues<Variants>)]?: (Key extends keyof GetVariantProps<ParentComponent> ? GetVariantProps<ParentComponent>[Key] : undefined) | (Key extends keyof (Variants extends void ? {} : GetVariantAcceptedValues<Variants>) ? (Variants extends void ? {} : GetVariantAcceptedValues<Variants>)[Key] : undefined) | undefined; }) & PseudoProps<Partial<GetBaseProps<ParentComponent> & (Variants extends {
    [propName: string]: VariantSpreadFunction<any, "_no_"> | ({
        "...fontSize"?: import("./types").FontSizeVariantSpreadFunction<any> | undefined;
        "...fontStyle"?: import("./types").FontStyleVariantSpreadFunction<any> | undefined;
        "...fontTransform"?: import("./types").FontTransformVariantSpreadFunction<any> | undefined;
        "...lineHeight"?: import("./types").FontLineHeightVariantSpreadFunction<any> | undefined;
        "...letterSpacing"?: import("./types").FontLetterSpacingVariantSpreadFunction<any> | undefined;
        "...size"?: import("./types").SizeVariantSpreadFunction<any> | undefined;
        "...space"?: import("./types").SpaceVariantSpreadFunction<any> | undefined;
        "...color"?: import("./types").ColorVariantSpreadFunction<any> | undefined;
        "...zIndex"?: import("./types").ZIndexVariantSpreadFunction<any> | undefined;
        "...theme"?: import("./types").ThemeVariantSpreadFunction<any> | undefined;
        "...radius"?: import("./types").RadiusVariantSpreadFunction<any> | undefined;
    } & {
        [x: string]: any;
        [x: number]: any;
    } & {
        ":string"?: VariantSpreadFunction<any, string> | undefined;
        ":boolean"?: VariantSpreadFunction<any, boolean> | undefined;
        ":number"?: VariantSpreadFunction<any, number> | undefined;
    });
} ? GetVariantProps<ParentComponent> : { [Key in keyof GetVariantProps<ParentComponent> | keyof (Variants extends void ? {} : GetVariantAcceptedValues<Variants>)]?: (Key extends keyof GetVariantProps<ParentComponent> ? GetVariantProps<ParentComponent>[Key] : undefined) | (Key extends keyof (Variants extends void ? {} : GetVariantAcceptedValues<Variants>) ? (Variants extends void ? {} : GetVariantAcceptedValues<Variants>)[Key] : undefined) | undefined; })>> & MediaProps<Partial<GetBaseProps<ParentComponent> & (Variants extends {
    [propName: string]: VariantSpreadFunction<any, "_no_"> | ({
        "...fontSize"?: import("./types").FontSizeVariantSpreadFunction<any> | undefined;
        "...fontStyle"?: import("./types").FontStyleVariantSpreadFunction<any> | undefined;
        "...fontTransform"?: import("./types").FontTransformVariantSpreadFunction<any> | undefined;
        "...lineHeight"?: import("./types").FontLineHeightVariantSpreadFunction<any> | undefined;
        "...letterSpacing"?: import("./types").FontLetterSpacingVariantSpreadFunction<any> | undefined;
        "...size"?: import("./types").SizeVariantSpreadFunction<any> | undefined;
        "...space"?: import("./types").SpaceVariantSpreadFunction<any> | undefined;
        "...color"?: import("./types").ColorVariantSpreadFunction<any> | undefined;
        "...zIndex"?: import("./types").ZIndexVariantSpreadFunction<any> | undefined;
        "...theme"?: import("./types").ThemeVariantSpreadFunction<any> | undefined;
        "...radius"?: import("./types").RadiusVariantSpreadFunction<any> | undefined;
    } & {
        [x: string]: any;
        [x: number]: any;
    } & {
        ":string"?: VariantSpreadFunction<any, string> | undefined;
        ":boolean"?: VariantSpreadFunction<any, boolean> | undefined;
        ":number"?: VariantSpreadFunction<any, number> | undefined;
    });
} ? GetVariantProps<ParentComponent> : { [Key in keyof GetVariantProps<ParentComponent> | keyof (Variants extends void ? {} : GetVariantAcceptedValues<Variants>)]?: (Key extends keyof GetVariantProps<ParentComponent> ? GetVariantProps<ParentComponent>[Key] : undefined) | (Key extends keyof (Variants extends void ? {} : GetVariantAcceptedValues<Variants>) ? (Variants extends void ? {} : GetVariantAcceptedValues<Variants>)[Key] : undefined) | undefined; })>>, GetRef<ParentComponent>, GetBaseProps<ParentComponent>, Variants extends {
    [propName: string]: VariantSpreadFunction<any, "_no_"> | ({
        "...fontSize"?: import("./types").FontSizeVariantSpreadFunction<any> | undefined;
        "...fontStyle"?: import("./types").FontStyleVariantSpreadFunction<any> | undefined;
        "...fontTransform"?: import("./types").FontTransformVariantSpreadFunction<any> | undefined;
        "...lineHeight"?: import("./types").FontLineHeightVariantSpreadFunction<any> | undefined;
        "...letterSpacing"?: import("./types").FontLetterSpacingVariantSpreadFunction<any> | undefined;
        "...size"?: import("./types").SizeVariantSpreadFunction<any> | undefined;
        "...space"?: import("./types").SpaceVariantSpreadFunction<any> | undefined;
        "...color"?: import("./types").ColorVariantSpreadFunction<any> | undefined;
        "...zIndex"?: import("./types").ZIndexVariantSpreadFunction<any> | undefined;
        "...theme"?: import("./types").ThemeVariantSpreadFunction<any> | undefined;
        "...radius"?: import("./types").RadiusVariantSpreadFunction<any> | undefined;
    } & {
        [x: string]: any;
        [x: number]: any;
    } & {
        ":string"?: VariantSpreadFunction<any, string> | undefined;
        ":boolean"?: VariantSpreadFunction<any, boolean> | undefined;
        ":number"?: VariantSpreadFunction<any, number> | undefined;
    });
} ? GetVariantProps<ParentComponent> : { [Key in keyof GetVariantProps<ParentComponent> | keyof (Variants extends void ? {} : GetVariantAcceptedValues<Variants>)]?: (Key extends keyof GetVariantProps<ParentComponent> ? GetVariantProps<ParentComponent>[Key] : undefined) | (Key extends keyof (Variants extends void ? {} : GetVariantAcceptedValues<Variants>) ? (Variants extends void ? {} : GetVariantAcceptedValues<Variants>)[Key] : undefined) | undefined; }, { [Key_1 in Exclude<keyof ParentComponent, "defaultProps" | "propTypes" | "staticConfig" | "extractable" | "styleable" | "$$typeof">]: ParentComponent[Key_1]; }>;
export {};
//# sourceMappingURL=styled.d.ts.map