import * as React from 'react';
declare const createRadioScope: import("@tamagui/create-context").CreateScope;
type PrimitiveButtonProps = any;
interface RadioProps extends PrimitiveButtonProps {
    checked?: boolean;
    required?: boolean;
    onCheck?(): void;
}
declare const Radio: React.ForwardRefExoticComponent<Pick<RadioProps, keyof RadioProps> & React.RefAttributes<any>>;
type PrimitiveSpanProps = any;
export interface RadioIndicatorProps extends PrimitiveSpanProps {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
}
declare const RadioIndicator: React.ForwardRefExoticComponent<Pick<RadioIndicatorProps, keyof RadioIndicatorProps> & React.RefAttributes<any>>;
export { createRadioScope, Radio, RadioIndicator, };
export type { RadioProps };
//# sourceMappingURL=Radio.d.ts.map