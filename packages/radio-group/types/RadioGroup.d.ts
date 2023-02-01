import * as RovingFocusGroup from '@radix-ui/react-roving-focus';
import * as React from 'react';
import { Radio, RadioIndicator } from './Radio';
declare const createRadioGroupScope: import("@tamagui/create-context").CreateScope;
type RadioGroupContextValue = {
    name?: string;
    required: boolean;
    disabled: boolean;
    value?: string;
    onValueChange(value: string): void;
};
type RovingFocusGroupProps = React.ComponentPropsWithoutRef<typeof RovingFocusGroup.Root>;
type PrimitiveDivProps = any;
interface RadioGroupProps extends PrimitiveDivProps {
    name?: RadioGroupContextValue['name'];
    required?: React.ComponentPropsWithoutRef<typeof Radio>['required'];
    disabled?: React.ComponentPropsWithoutRef<typeof Radio>['disabled'];
    dir?: RovingFocusGroupProps['dir'];
    orientation?: RovingFocusGroupProps['orientation'];
    loop?: RovingFocusGroupProps['loop'];
    defaultValue?: string;
    value?: RadioGroupContextValue['value'];
    onValueChange?: RadioGroupContextValue['onValueChange'];
}
declare const RadioGroup: React.ForwardRefExoticComponent<Pick<RadioGroupProps, keyof RadioGroupProps> & React.RefAttributes<any>>;
type RadioProps = React.ComponentPropsWithoutRef<typeof Radio>;
interface RadioGroupItemProps extends Omit<RadioProps, 'onCheck' | 'name'> {
    value: string;
}
declare const RadioGroupItem: React.ForwardRefExoticComponent<Pick<RadioGroupItemProps, keyof RadioGroupItemProps> & React.RefAttributes<any>>;
type RadioIndicatorProps = React.ComponentPropsWithoutRef<typeof RadioIndicator>;
interface RadioGroupIndicatorProps extends RadioIndicatorProps {
}
declare const RadioGroupIndicator: React.ForwardRefExoticComponent<Pick<RadioGroupIndicatorProps, keyof RadioGroupIndicatorProps> & React.RefAttributes<any>>;
declare const Root: React.ForwardRefExoticComponent<Pick<RadioGroupProps, keyof RadioGroupProps> & React.RefAttributes<any>>;
declare const Item: React.ForwardRefExoticComponent<Pick<RadioGroupItemProps, keyof RadioGroupItemProps> & React.RefAttributes<any>>;
declare const Indicator: React.ForwardRefExoticComponent<Pick<RadioGroupIndicatorProps, keyof RadioGroupIndicatorProps> & React.RefAttributes<any>>;
export { createRadioGroupScope, RadioGroup, RadioGroupItem, RadioGroupIndicator, Root, Item, Indicator, };
export type { RadioGroupProps, RadioGroupItemProps, RadioGroupIndicatorProps };
//# sourceMappingURL=RadioGroup.d.ts.map