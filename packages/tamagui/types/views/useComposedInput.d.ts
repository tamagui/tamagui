import { TamaguiReactElement } from '@tamagui/web';
import { ReactNode } from 'react';
export declare const START_INPUT_ADORNMENT_NAME = "StartInputAdornment";
export declare const END_INPUT_ADORNMENT_NAME = "EndInputAdornment";
interface ComposedInputComponents {
    startAdornments?: TamaguiReactElement[];
    endAdornments?: TamaguiReactElement[];
}
export interface ComposedInputReturn {
    formComponents: ComposedInputComponents;
    children?: ReactNode;
}
export declare const useComposedInput: (children: ReactNode, override?: ComposedInputReturn) => ComposedInputReturn;
export {};
//# sourceMappingURL=useComposedInput.d.ts.map