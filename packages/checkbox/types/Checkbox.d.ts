import * as React from 'react';
type PrimitiveSpanProps = any;
export interface CheckboxIndicatorProps extends PrimitiveSpanProps {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
}
declare const createCheckboxScope: import("@tamagui/create-context").CreateScope;
type CheckedState = boolean | 'indeterminate';
type PrimitiveButtonProps = any;
export interface CheckboxProps extends Omit<PrimitiveButtonProps, 'checked' | 'defaultChecked'> {
    checked?: CheckedState;
    defaultChecked?: CheckedState;
    required?: boolean;
    onCheckedChange?(checked: CheckedState): void;
}
export declare const Checkbox: React.ForwardRefExoticComponent<Pick<CheckboxProps, keyof CheckboxProps> & React.RefAttributes<any>> & {
    Indicator: React.ForwardRefExoticComponent<Pick<CheckboxIndicatorProps, keyof CheckboxIndicatorProps> & React.RefAttributes<any>>;
};
export { createCheckboxScope };
//# sourceMappingURL=Checkbox.d.ts.map