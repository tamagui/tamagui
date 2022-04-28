/// <reference types="react" />
import { IPopperProps } from './types';
export declare type PopperContext = Omit<IPopperProps, 'children'> & {
    triggerRef: any;
    onClose: any;
    setOverlayRef?: (overlayRef: any) => void;
};
export declare const PopperContext: import("react").Context<PopperContext | null>;
//# sourceMappingURL=PopperContext.d.ts.map