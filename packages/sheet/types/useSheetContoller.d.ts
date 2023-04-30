/// <reference types="react" />
export declare const useSheetContoller: () => {
    controller: SheetControllerContextValue | null;
    isHidden: boolean | undefined;
    isShowingNonSheet: boolean | undefined;
};
export declare const SheetControllerContext: import("react").Context<SheetControllerContextValue | null>;
export type SheetControllerContextValue = {
    disableDrag?: boolean;
    open?: boolean;
    hidden?: boolean;
    onOpenChange?: React.Dispatch<React.SetStateAction<boolean>> | ((val: boolean) => void);
};
//# sourceMappingURL=useSheetContoller.d.ts.map