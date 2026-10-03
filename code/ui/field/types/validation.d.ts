import type { FormValues } from '@tamagui/form';
import type { FieldValidationMode, FieldValidator, FieldValidityState } from './types';
export declare function createDefaultValidityState(valid?: boolean | null): FieldValidityState;
export declare function normalizeNativeValidity(state: FieldValidityState, showValueMissing: boolean): {
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
export declare function isFilled(value: unknown): boolean;
export declare function shouldValidateOnChange(mode: FieldValidationMode, submitAttempted: boolean): boolean;
export declare function getValidationResult(validator: FieldValidator, value: unknown, formValues: FormValues): string[] | Promise<string[]>;
export declare function createValidationCommitter<Value>(commit: (value: Value) => void): {
    invalidate(): void;
    run(value: Value | PromiseLike<Value>): Value | Promise<Value>;
};
//# sourceMappingURL=validation.d.ts.map