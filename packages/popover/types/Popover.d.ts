import * as React from 'react';
declare const createPopoverScope: import("@tamagui/create-context").CreateScope;
interface PopoverProps {
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    modal?: boolean;
}
declare const Popover: React.FC<PopoverProps>;
declare type PopperAnchorProps = any;
interface PopoverAnchorProps extends PopperAnchorProps {
}
declare const PopoverAnchor: React.ForwardRefExoticComponent<Pick<PopoverAnchorProps, string | number> & React.RefAttributes<any>>;
declare type PrimitiveButtonProps = any;
interface PopoverTriggerProps extends PrimitiveButtonProps {
}
declare const PopoverTrigger: React.ForwardRefExoticComponent<Pick<PopoverTriggerProps, string | number> & React.RefAttributes<any>>;
interface PopoverContentProps extends PopoverContentTypeProps {
    forceMount?: true;
}
declare const PopoverContent: React.ForwardRefExoticComponent<Pick<PopoverContentProps, keyof PopoverContentProps> & React.RefAttributes<any>>;
declare type RemoveScrollProps = any;
interface PopoverContentTypeProps extends Omit<PopoverContentImplProps, 'trapFocus' | 'disableOutsidePointerEvents'> {
    allowPinchZoom?: RemoveScrollProps['allowPinchZoom'];
    portalled?: boolean;
}
declare type FocusScopeProps = any;
declare type DismissableLayerProps = any;
declare type PopperContentProps = any;
interface PopoverContentImplProps extends PopperContentProps, Omit<DismissableLayerProps, 'onDismiss'> {
    trapFocus?: FocusScopeProps['trapped'];
    onOpenAutoFocus?: FocusScopeProps['onMountAutoFocus'];
    onCloseAutoFocus?: FocusScopeProps['onUnmountAutoFocus'];
}
interface PopoverCloseProps extends PrimitiveButtonProps {
}
declare const PopoverClose: React.ForwardRefExoticComponent<Pick<PopoverCloseProps, string | number> & React.RefAttributes<any>>;
declare type PopperArrowProps = any;
interface PopoverArrowProps extends PopperArrowProps {
}
declare const PopoverArrow: React.ForwardRefExoticComponent<Pick<PopoverArrowProps, string | number> & React.RefAttributes<any>>;
export { createPopoverScope, Popover, PopoverAnchor, PopoverTrigger, PopoverContent, PopoverClose, PopoverArrow, };
export type { PopoverProps, PopoverAnchorProps, PopoverTriggerProps, PopoverContentProps, PopoverCloseProps, PopoverArrowProps, };
//# sourceMappingURL=Popover.d.ts.map