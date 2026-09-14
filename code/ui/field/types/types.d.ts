import type { FormValidationMode, FormValues } from '@tamagui/form';
import type * as React from 'react';
export type FieldValidationResult = string | string[] | null;
export type StandardSchemaIssue = {
    message: string;
    path?: ReadonlyArray<PropertyKey | {
        key: PropertyKey;
    }>;
};
export type StandardSchemaV1 = {
    readonly '~standard': {
        readonly version: 1;
        readonly vendor: string;
        readonly validate: (value: unknown) => {
            value: unknown;
            issues?: undefined;
        } | {
            issues: ReadonlyArray<StandardSchemaIssue>;
        } | Promise<{
            value: unknown;
            issues?: undefined;
        } | {
            issues: ReadonlyArray<StandardSchemaIssue>;
        }>;
    };
};
export type FieldValidator = ((value: unknown, formValues: FormValues) => FieldValidationResult | Promise<FieldValidationResult>) | StandardSchemaV1;
export type FieldValidityState = {
    badInput: boolean;
    customError: boolean;
    patternMismatch: boolean;
    rangeOverflow: boolean;
    rangeUnderflow: boolean;
    stepMismatch: boolean;
    tooLong: boolean;
    tooShort: boolean;
    typeMismatch: boolean;
    valueMissing: boolean;
    valid: boolean | null;
};
export type FieldValidityData = {
    state: FieldValidityState;
    error: string;
    errors: string[];
    value: unknown;
    initialValue: unknown;
};
export type FieldState = {
    name?: string;
    value: unknown;
    error: string;
    errors: string[];
    validity: FieldValidityState;
    valid: boolean | null;
    touched: boolean;
    dirty: boolean;
    filled: boolean;
    focused: boolean;
    disabled: boolean;
};
export type FieldStyleState = {
    valid: boolean;
    invalid: boolean;
    touched: boolean;
    dirty: boolean;
    filled: boolean;
    focused: boolean;
    disabled: boolean;
};
export type FieldDataProps = {
    'data-valid'?: '';
    'data-invalid'?: '';
    'data-touched'?: '';
    'data-dirty'?: '';
    'data-filled'?: '';
    'data-focused'?: '';
    'data-disabled'?: '';
};
export type FieldAriaProps = {
    id?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
    'aria-invalid'?: true;
    accessibilityLabel?: string;
    accessibilityHint?: string;
    accessibilityState?: {
        disabled?: boolean;
    };
};
export type FieldControlRegistration = {
    id?: string;
    name?: string;
    controlRef: React.RefObject<any>;
    inputRef?: React.RefObject<any>;
    getValue?: () => unknown;
    value?: unknown;
    disabled?: boolean;
    required?: boolean;
};
export type FieldControlContextValue = {
    name?: string;
    disabled: boolean;
    ariaProps: FieldAriaProps;
    dataProps: FieldDataProps;
    onFocus: () => void;
    onBlur: (value?: unknown) => void;
    onChange: (value: unknown) => void;
    onDisabledChange: (disabled: boolean) => void;
    registerControl: (registration: FieldControlRegistration) => () => void;
};
export type FieldValidationMode = FormValidationMode;
//# sourceMappingURL=types.d.ts.map