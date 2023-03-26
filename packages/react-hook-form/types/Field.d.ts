import { YStackProps } from '@tamagui/stacks';
import { PropsWithChildren } from 'react';
import { FieldPath, FieldValues } from 'react-hook-form';
export type FieldControlledProps<TFieldValues extends FieldValues = FieldValues> = PropsWithChildren<{
    name: FieldPath<TFieldValues>;
}> & YStackProps;
export declare function FieldControlled<TFieldValues extends FieldValues = FieldValues>({ children, name, ...props }: FieldControlledProps<TFieldValues>): JSX.Element;
//# sourceMappingURL=Field.d.ts.map