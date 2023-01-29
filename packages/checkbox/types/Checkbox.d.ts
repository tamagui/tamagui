import { TamaguiElement } from '@tamagui/core';
import { ThemeableStackProps } from '@tamagui/stacks';
import * as React from 'react';
export interface CheckboxIndicatorProps extends ThemeableStackProps {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
}
declare const createCheckboxScope: import("@tamagui/create-context").CreateScope;
type CheckedState = boolean | 'indeterminate';
export interface CheckboxProps extends Omit<ThemeableStackProps, 'checked' | 'defaultChecked'> {
    checked?: CheckedState;
    defaultChecked?: CheckedState;
    required?: boolean;
    onCheckedChange?(checked: CheckedState): void;
    name?: string;
    value?: string;
}
export declare const Checkbox: React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<any>> & {
    Indicator: React.ForwardRefExoticComponent<CheckboxIndicatorProps & React.RefAttributes<TamaguiElement>>;
};
export { createCheckboxScope };
//# sourceMappingURL=Checkbox.d.ts.map