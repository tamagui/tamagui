import type { ReactNode } from 'react';
export type SelectMode = 'single' | 'multiple';
export type SelectSelection = string | string[];
export type SelectRegisteredItem = {
    id: symbol;
    value: string;
    disabled: boolean;
    textValue?: string;
    label?: ReactNode;
};
export type SelectItemRegistration = {
    id: symbol;
    update(item: Partial<Omit<SelectRegisteredItem, 'id'>>): void;
    setNode(node: unknown): void;
    unregister(): void;
};
export type SelectItemRegistry = ReturnType<typeof createSelectItemRegistry>;
export declare function getSelectLabelText(label: ReactNode): string;
export declare function createSelectItemRegistry(onChange?: () => void): {
    subscribe(listener: () => void): () => void;
    registerItem: (item: Omit<SelectRegisteredItem, 'id'>) => SelectItemRegistration;
    registerLabel: (value: string, label: ReactNode, textValue?: string) => () => void;
    getItems: () => SelectRegisteredItem[];
    getItem: (value: string) => SelectRegisteredItem | undefined;
    getIndex: (value: string) => number;
    firstEnabledIndex: () => number;
    nextEnabledIndex: (fromIndex: number | null, direction: 1 | -1) => number;
    findTypeaheadIndex: (search: string, fromIndex: number | null) => number;
    getDisabledIndices: () => number[];
    getTypeaheadLabels: () => string[];
};
export declare function normalizeSelectSelection(mode: SelectMode, value: SelectSelection | undefined): SelectSelection;
export declare function selectedValuesFromSelection(mode: SelectMode, value: SelectSelection | undefined): string[];
export declare function createSelectSelectionController({ mode: initialMode, value: initialValue, registry, }: {
    mode: SelectMode;
    value: SelectSelection;
    registry: SelectItemRegistry;
}): {
    registry: {
        subscribe(listener: () => void): () => void;
        registerItem: (item: Omit<SelectRegisteredItem, 'id'>) => SelectItemRegistration;
        registerLabel: (value: string, label: ReactNode, textValue?: string) => () => void;
        getItems: () => SelectRegisteredItem[];
        getItem: (value: string) => SelectRegisteredItem | undefined;
        getIndex: (value: string) => number;
        firstEnabledIndex: () => number;
        nextEnabledIndex: (fromIndex: number | null, direction: 1 | -1) => number;
        findTypeaheadIndex: (search: string, fromIndex: number | null) => number;
        getDisabledIndices: () => number[];
        getTypeaheadLabels: () => string[];
    };
    readonly mode: SelectMode;
    readonly value: SelectSelection;
    readonly activeIndex: number | null;
    readonly activeItem: SelectRegisteredItem | undefined;
    readonly shouldCloseOnSelect: boolean;
    setMode: (nextMode: SelectMode) => SelectSelection;
    setValue: (nextValue: SelectSelection) => SelectSelection;
    isSelected: (itemValue: string) => boolean;
    toggle: (itemValue: string) => SelectSelection;
    selectionAnchor: () => SelectRegisteredItem | undefined;
    selectionAnchorIndex: () => number;
    initialActiveIndex: () => number;
    setActiveIndex(index: number | null): void;
    moveActive: (direction: 1 | -1) => SelectRegisteredItem | undefined;
};
export declare function getSelectListboxProps(mode: SelectMode): {
    role: 'listbox';
    'aria-multiselectable': boolean | undefined;
};
export declare function getSelectOptionProps(mode: SelectMode, selected: boolean, disabled: boolean, platform: 'web' | 'native'): {
    accessibilityRole: "button" | "checkbox";
    accessibilityState: {
        selected: boolean | undefined;
        checked: boolean | undefined;
        disabled: boolean;
    };
    role?: undefined;
    'aria-selected'?: undefined;
    'aria-disabled'?: undefined;
} | {
    accessibilityRole?: undefined;
    accessibilityState?: undefined;
    role: 'option';
    'aria-selected': boolean;
    'aria-disabled': true | undefined;
};
//# sourceMappingURL=selectionController.d.ts.map