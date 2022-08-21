declare type Value = Object | Array<any> | string | number;
declare type Style = {
    [K in string]: Value;
};
declare type Rule = string;
declare type Rules = Array<Rule>;
declare type RulesData = [Rules, number];
declare type CompiledStyle = {
    [K in string]: string | Array<string>;
};
declare type CompilerOutput = [CompiledStyle, Array<RulesData>];
export declare function atomic(style: Style): CompilerOutput;
export declare function classic(style: Style, name: string): CompilerOutput;
export declare function inline(originalStyle: Style, isRTL?: boolean): {
    [K in string]: unknown;
};
export declare function stringifyValueWithProperty(value: Value, property: string | null): string;
export {};
//# sourceMappingURL=index.d.ts.map