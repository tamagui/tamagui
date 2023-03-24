/// <reference types="react" />
import { ControllerProps, ControllerRenderProps } from 'react-hook-form';
export declare function withController<TProps>(Component: React.JSXElementConstructor<TProps>, mapProps?: Partial<Record<keyof ControllerRenderProps, keyof TProps>>): import("react").ForwardRefExoticComponent<import("react").PropsWithoutRef<TProps & Omit<ControllerProps<import("react-hook-form").FieldValues, string>, "render" | "control">> & import("react").RefAttributes<unknown>>;
//# sourceMappingURL=withController.d.ts.map