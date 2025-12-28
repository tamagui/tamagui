import * as React from 'react';
export type TabsActivationMode = 'automatic' | 'manual';
export type TabsOrientation = 'horizontal' | 'vertical';
export type Direction = 'ltr' | 'rtl';
export interface UseTabsProps {
    /** The value for the selected tab, if controlled */
    value?: string;
    /** The value of the tab to select by default, if uncontrolled */
    defaultValue?: string;
    /** A function called when a new tab is selected */
    onValueChange?: (value: string) => void;
    /**
     * The orientation the tabs are layed out.
     * Mainly so arrow navigation is done accordingly (left & right vs. up & down)
     * @defaultValue horizontal
     */
    orientation?: TabsOrientation;
    /**
     * The direction of navigation between toolbar items.
     */
    dir?: Direction;
    /**
     * Whether a tab is activated automatically (on focus) or manually (on click/enter).
     * @defaultValue automatic
     */
    activationMode?: TabsActivationMode;
    /**
     * Whether keyboard navigation should loop from last to first and vice versa.
     * @defaultValue true
     */
    loop?: boolean;
}
export interface UseTabsReturn {
    /** The currently selected tab value */
    value: string;
    /** Function to change the selected tab */
    setValue: (value: string) => void;
    /** The resolved text direction */
    direction: Direction;
    /** Props to spread on the tabs container element */
    tabsProps: {
        'data-orientation': TabsOrientation;
        dir: Direction;
    };
    /** Props to spread on the tab list element */
    listProps: {
        role: 'tablist';
        'aria-orientation': TabsOrientation;
    };
    /** Function to get props for a tab trigger */
    getTabProps: (tabValue: string, disabled?: boolean) => TabTriggerProps;
    /** Function to get props for a tab content panel */
    getContentProps: (tabValue: string) => TabContentProps;
    /** Context value to provide to child components */
    contextValue: TabsContextValue;
}
export interface TabTriggerProps {
    role: 'tab';
    id: string;
    'aria-selected': boolean;
    'aria-controls': string;
    'data-state': 'active' | 'inactive';
    'data-disabled'?: '';
    disabled?: boolean;
    tabIndex: number;
    onKeyDown: (event: React.KeyboardEvent) => void;
    onClick: (event: React.MouseEvent) => void;
    onFocus: (event: React.FocusEvent) => void;
}
export interface TabContentProps {
    role: 'tabpanel';
    id: string;
    'aria-labelledby': string;
    'data-state': 'active' | 'inactive';
    'data-orientation': TabsOrientation;
    hidden: boolean;
    tabIndex: 0;
}
export interface TabsContextValue {
    baseId: string;
    value: string;
    setValue: (value: string) => void;
    orientation: TabsOrientation;
    direction: Direction;
    activationMode: TabsActivationMode;
    loop: boolean;
}
export declare function useTabs(props?: UseTabsProps): UseTabsReturn;
export declare const TabsProvider: React.Provider<TabsContextValue | null>;
export declare function useTabsContext(): TabsContextValue;
export interface UseTabProps {
    value: string;
    disabled?: boolean;
    onPress?: (event: any) => void;
    onKeyDown?: (event: React.KeyboardEvent) => void;
    onFocus?: (event: React.FocusEvent) => void;
}
export declare function useTab(props: UseTabProps): {
    isSelected: boolean;
    tabProps: {
        disabled: boolean | undefined;
        tabIndex: number;
        onKeyDown: import("@tamagui/helpers").EventHandler<React.KeyboardEvent<Element>> | undefined;
        onPress: import("@tamagui/helpers").EventHandler<any> | undefined;
        onFocus: import("@tamagui/helpers").EventHandler<React.FocusEvent<Element, Element>> | undefined;
        'data-disabled'?: "" | undefined;
        ref: React.RefObject<HTMLElement | null>;
        role: "tab";
        id: string;
        'aria-selected': boolean;
        'aria-controls': string;
        'data-state': string;
    };
};
export interface UseTabContentProps {
    value: string;
    forceMount?: boolean;
}
export declare function useTabContent(props: UseTabContentProps): {
    isSelected: boolean;
    shouldMount: boolean;
    contentProps: {
        role: "tabpanel";
        id: string;
        'aria-labelledby': string;
        'data-state': string;
        'data-orientation': TabsOrientation;
        hidden: boolean;
        tabIndex: number;
    };
};
//# sourceMappingURL=useTabs.d.ts.map