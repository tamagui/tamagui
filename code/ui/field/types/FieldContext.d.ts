import * as React from 'react';
import type { FieldControlContextValue, FieldState, FieldStyleState } from './types';
export declare const defaultFieldState: FieldState;
export declare const defaultFieldControl: FieldControlContextValue;
export declare const FieldControlContext: React.Context<FieldControlContextValue>;
export declare const FieldControlProvider: React.Provider<FieldControlContextValue>;
export declare function useFieldControl(): FieldControlContextValue;
export declare const FieldStateContext: React.Context<FieldState>;
export declare function useFieldState(): FieldState;
export declare const FieldStyledContext: import("@tamagui/core").StyledContext<FieldStyleState, keyof FieldStyleState>;
//# sourceMappingURL=FieldContext.d.ts.map