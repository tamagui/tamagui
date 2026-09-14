import React from 'react';
import type { SelectProps } from 'tamagui';
export declare function SelectDemo(): import("react/jsx-runtime").JSX.Element;
type SelectValue = Lowercase<(typeof items)[number]['name']>;
export declare function SelectDemoContents(props: SelectProps<SelectValue> & {
    trigger?: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
declare const items: readonly [{
    readonly name: "Apple";
}, {
    readonly name: "Pear";
}, {
    readonly name: "Blackberry";
}, {
    readonly name: "Peach";
}, {
    readonly name: "Apricot";
}, {
    readonly name: "Melon";
}, {
    readonly name: "Honeydew";
}, {
    readonly name: "Starfruit";
}, {
    readonly name: "Blueberry";
}, {
    readonly name: "Raspberry";
}, {
    readonly name: "Strawberry";
}, {
    readonly name: "Mango";
}, {
    readonly name: "Pineapple";
}, {
    readonly name: "Lime";
}, {
    readonly name: "Lemon";
}, {
    readonly name: "Coconut";
}, {
    readonly name: "Guava";
}, {
    readonly name: "Papaya";
}, {
    readonly name: "Orange";
}, {
    readonly name: "Grape";
}, {
    readonly name: "Jackfruit";
}, {
    readonly name: "Durian";
}];
export {};
//# sourceMappingURL=SelectDemo.d.ts.map