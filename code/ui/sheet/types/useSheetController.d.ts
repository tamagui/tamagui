import React from 'react';
export declare const useSheetController: () => {
    controller: SheetControllerContextValue | null;
    isHidden: boolean | undefined;
    isShowingNonSheet: boolean | undefined;
    disableDrag: boolean | undefined;
};
export declare const SheetControllerContext: React.Context<SheetControllerContextValue | null>;
export type SheetControllerContextValue = {
    disableDrag?: boolean;
    open?: boolean;
    hidden?: boolean;
    onOpenChange?: React.Dispatch<React.SetStateAction<boolean>> | ((val: boolean) => void);
};
//# sourceMappingURL=useSheetController.d.ts.map