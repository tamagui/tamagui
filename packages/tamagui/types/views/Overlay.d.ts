/// <reference types="react" />
interface IOverlayProps {
    isOpen?: boolean;
    children?: any;
    useRNModalOnAndroid?: boolean;
    onRequestClose?: (() => any) | undefined;
    isKeyboardDismissable?: boolean;
}
export declare function Overlay({ children, isOpen, useRNModalOnAndroid, isKeyboardDismissable, onRequestClose, }: IOverlayProps): JSX.Element;
export {};
//# sourceMappingURL=Overlay.d.ts.map