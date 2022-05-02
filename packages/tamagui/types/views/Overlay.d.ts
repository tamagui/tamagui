/// <reference types="react" />
interface IOverlayProps {
    open?: boolean;
    children?: any;
    useRNModalOnAndroid?: boolean;
    onRequestClose?: (() => any) | undefined;
    isKeyboardDismissable?: boolean;
}
export declare function Overlay({ children, open, useRNModalOnAndroid, isKeyboardDismissable, onRequestClose, }: IOverlayProps): JSX.Element | null;
export {};
//# sourceMappingURL=Overlay.d.ts.map