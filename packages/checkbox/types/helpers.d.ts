export type CheckedState = boolean | 'indeterminate';
export declare function isIndeterminate(checked?: CheckedState): checked is 'indeterminate';
export declare function getState(checked: CheckedState): "indeterminate" | "checked" | "unchecked";
//# sourceMappingURL=helpers.d.ts.map