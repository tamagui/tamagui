import type React from 'react';
import { type StyledContext } from '@tamagui/core';
export declare const useSheetController: (scope?: string) => {
    controller: SheetControllerContextValue | null;
    isHidden: boolean | undefined;
    isShowingNonSheet: boolean | undefined;
    disableDrag: boolean | undefined;
};
export declare const SheetControllerContext: StyledContext<SheetControllerContextValue> & React.Context<SheetControllerContextValue | null>;
export type SheetControllerContextValue = {
    id?: string;
    disableDrag?: boolean;
    open?: boolean;
    hidden?: boolean;
    onOpenChange?: React.Dispatch<React.SetStateAction<boolean>> | ((val: boolean) => void);
    onAnimationComplete?: (state: {
        open: boolean;
    }) => void;
    skipNextAnimation?: boolean;
};
//# sourceMappingURL=useSheetController.d.ts.map