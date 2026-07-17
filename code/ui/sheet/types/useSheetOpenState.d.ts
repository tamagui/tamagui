import type { SheetProps } from './types';
import type { SheetControllerContextValue } from './useSheetController';
export declare const useSheetOpenState: (props: SheetProps) => {
    open: boolean;
    setOpen: import("@tamagui/use-controllable-state").ControllableStateSetter<boolean, import("@tamagui/web").TamaguiChangeEventDetails>;
    isHidden: boolean | undefined;
    controller: SheetControllerContextValue | null;
};
export type SheetOpenState = ReturnType<typeof useSheetOpenState>;
//# sourceMappingURL=useSheetOpenState.d.ts.map