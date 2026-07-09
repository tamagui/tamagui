import React from 'react';
import type { SheetProps } from './types';
import type { SheetControllerContextValue } from './useSheetController';
export declare const useSheetOpenState: (props: SheetProps) => {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isHidden: boolean | undefined;
    controller: SheetControllerContextValue | null;
};
export type SheetOpenState = ReturnType<typeof useSheetOpenState>;
//# sourceMappingURL=useSheetOpenState.d.ts.map