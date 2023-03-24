/// <reference types="react" />
import { ControllerProps, ControllerRenderProps } from 'react-hook-form';
export declare function withController<TProps>(Component: React.JSXElementConstructor<TProps>, mapProps?: Partial<Record<keyof ControllerRenderProps, keyof TProps>>): (props: TProps & Omit<ControllerProps, 'render' | 'control'>) => JSX.Element;
//# sourceMappingURL=controlledInput.d.ts.map