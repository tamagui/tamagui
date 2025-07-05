import type { SheetContextValue } from './useSheetProviderProps';
export declare const createSheetContext: <ContextValueType extends object | null>(rootComponentName: string, defaultContext?: ContextValueType) => readonly [(props: ContextValueType & {
    scope: import("@tamagui/create-context").Scope<ContextValueType>;
    children: React.ReactNode;
}) => import("react/jsx-runtime").JSX.Element, (consumerName: string, scope: import("@tamagui/create-context").Scope<ContextValueType | undefined>, options?: {
    warn?: boolean;
    fallback?: Partial<ContextValueType>;
}) => ContextValueType], createSheetScope: import("@tamagui/create-context").CreateScope;
export declare const SheetProvider: (props: {
    screenSize: number;
    maxSnapPoint: string | number;
    removeScrollEnabled: boolean | undefined;
    scrollBridge: import("./types").ScrollBridge;
    modal: boolean;
    open: boolean;
    setOpen: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    hidden: boolean;
    contentRef: import("react").RefObject<import("@tamagui/web").TamaguiElement | null>;
    handleRef: import("react").RefObject<import("@tamagui/web").TamaguiElement | null>;
    frameSize: number;
    setFrameSize: import("react").Dispatch<import("react").SetStateAction<number>>;
    dismissOnOverlayPress: boolean;
    dismissOnSnapToBottom: boolean;
    onOverlayComponent: ((comp: any) => void) | undefined;
    scope: import("@tamagui/create-context").Scope<any>;
    hasFit: boolean;
    position: number;
    snapPoints: (string | number)[];
    snapPointsMode: import("./types").SnapPointsMode;
    setMaxContentSize: import("react").Dispatch<import("react").SetStateAction<number>>;
    setPosition: (next: number) => void;
    setPositionImmediate: import("react").Dispatch<import("react").SetStateAction<number>>;
    onlyShowFrame: boolean;
} & {
    setHasScrollView: (val: boolean) => void;
} & {
    scope: import("@tamagui/create-context").Scope<SheetContextValue>;
    children: React.ReactNode;
}) => import("react/jsx-runtime").JSX.Element, useSheetContext: (consumerName: string, scope: import("@tamagui/create-context").Scope<SheetContextValue | undefined>, options?: {
    warn?: boolean;
    fallback?: Partial<SheetContextValue> | undefined;
} | undefined) => SheetContextValue;
//# sourceMappingURL=SheetContext.d.ts.map