import { TextStyle, ViewStyle } from 'react-native';
export declare function expandStyles(style: any): {};
export declare function inline(style: Style): Object;
declare type Rule = string;
declare type Rules = Array<Rule>;
export declare type RulesData = {
    property?: string;
    value?: string;
    identifier: string;
    rules: Rules;
};
declare type CompilerOutput = {
    [key: string]: RulesData;
};
declare type Value = Object | Array<any> | string | number;
export declare type Style = {
    [key: string]: Value;
};
export declare const generateAtomicStyles: (style: ViewStyle & TextStyle) => CompilerOutput;
export declare function expandStyle(key: string, value: any): any;
export {};
//# sourceMappingURL=generateAtomicStyles.d.ts.map