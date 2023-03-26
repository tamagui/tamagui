/// <reference types="react" />
import { SizableTextProps } from '@tamagui/text';
import { FieldValues } from 'react-hook-form';
export type ValueProps = SizableTextProps & {
    name: keyof FieldValues;
};
export declare const Value: ({ name, ...props }: ValueProps) => JSX.Element;
//# sourceMappingURL=Value.d.ts.map