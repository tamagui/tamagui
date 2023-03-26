/// <reference types="react" />
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { WithControllerProps } from './types';
export declare function withController<TProps, TFieldValues extends FieldValues = FieldValues>(Component: React.JSXElementConstructor<TProps>, mapProps?: Partial<Record<keyof ControllerRenderProps, keyof TProps>>): import("react").ForwardRefExoticComponent<import("react").PropsWithoutRef<WithControllerProps<Partial<TProps>, TFieldValues>> & import("react").RefAttributes<unknown>>;
//# sourceMappingURL=withController.d.ts.map