/// <reference types="react" />
export declare const useSheet: () => Required<Pick<import("./types").SheetProps, "position" | "open" | "snapPoints" | "dismissOnOverlayPress">> & {
    hidden: boolean;
    setPosition: import("./types").PositionChangeHandler;
    setOpen: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    contentRef: import("react").RefObject<import("@tamagui/web").TamaguiElement>;
    dismissOnSnapToBottom: boolean;
    scrollBridge: import("./types").ScrollBridge;
    frameSize: number;
    modal: boolean;
};
//# sourceMappingURL=useSheet.d.ts.map