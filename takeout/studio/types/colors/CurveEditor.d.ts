import React from 'react';
type CurveEditorProps = {
    values: readonly number[];
    min: number;
    max: number;
    step?: number;
    onChange?: (values: number[], shiftKey: boolean, index?: number) => void;
    onFocus?: (index: number) => void;
    onBlur?: () => void;
    disabled?: boolean;
    label?: string;
    style?: React.SVGAttributes<SVGSVGElement>['style'];
};
export declare function CurveEditor({ values, min, max, onChange, onFocus, onBlur, step, disabled, label, style, }: CurveEditorProps): JSX.Element;
export {};
//# sourceMappingURL=CurveEditor.d.ts.map