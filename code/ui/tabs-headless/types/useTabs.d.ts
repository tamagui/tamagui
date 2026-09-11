import * as React from 'react';
export type TabsActivationMode = 'automatic' | 'manual';
export type TabsOrientation = 'horizontal' | 'vertical';
export type Direction = 'ltr' | 'rtl';
export declare function makeTriggerId(baseId: string, value: string): string;
export declare function makeContentId(baseId: string, value: string): string;
export interface UseTabsProps {
    /** The value for the selected tab, if controlled */
    value?: string;
    /** The value of the tab to select by default, if uncontrolled */
    defaultValue?: string;
    /** A function called when a new tab is selected */
    onValueChange?: (value: string) => void;
    /**
     * The orientation the tabs are laid out.
     * @defaultValue horizontal
     */
    orientation?: TabsOrientation;
    /** The direction of navigation between tab triggers. */
    dir?: Direction;
    /**
     * Whether a tab is activated automatically (on focus) or manually (on press/enter).
     * Automatic activation is web-only; native always activates manually.
     * @defaultValue automatic
     */
    activationMode?: TabsActivationMode;
}
export declare function useTabs(props?: UseTabsProps): {
    value: string;
    setValue: import("@tamagui/use-controllable-state").ControllableStateSetter<string, import("@tamagui/web").TamaguiChangeEventDetails>;
    baseId: string;
    direction: "ltr" | "rtl";
    orientation: TabsOrientation;
    activationMode: TabsActivationMode;
    triggersCount: number;
    registerTrigger: () => void;
    unregisterTrigger: () => void;
    tabsProps: {
        'data-orientation': TabsOrientation;
    };
};
export interface UseTabsListProps {
    orientation?: TabsOrientation;
    /** Disables every trigger in the list. */
    disabled?: boolean;
}
export declare function useTabsList(props: UseTabsListProps): {
    listProps: {
        role: 'tablist';
        'aria-orientation': TabsOrientation;
        'aria-disabled': true | undefined;
        'data-orientation': TabsOrientation;
        'data-disabled': "" | undefined;
    };
};
/** the fields the primary-pointer check reads off a web press event */
export type TabPressEvent = {
    button?: number;
    ctrlKey?: boolean;
};
export interface UseTabProps {
    baseId: string;
    /** The value this trigger selects. */
    value: string;
    /** The currently selected value. */
    selectedValue?: string;
    disabled?: boolean;
    activationMode?: TabsActivationMode;
    onChange: (value: string) => void;
}
export declare function useTab(props: UseTabProps): {
    isSelected: boolean;
    triggerId: string;
    contentId: string;
    tabProps: {
        role: 'tab';
        id: string;
        'aria-selected': boolean;
        'aria-controls': string;
        'data-state': "active" | "inactive";
        'data-disabled': "" | undefined;
        disabled: boolean;
        onPress: (event?: TabPressEvent) => void;
        onKeyDown?: ((event: React.KeyboardEvent) => void) | undefined;
        onFocus?: (() => void) | undefined;
    };
};
export interface UseTabContentProps {
    baseId: string;
    /** The value that selects this content. */
    value: string;
    /** The currently selected value. */
    selectedValue?: string;
    orientation?: TabsOrientation;
    /** Mounts the content even when its value is not selected. */
    forceMount?: boolean;
}
export declare function useTabContent(props: UseTabContentProps): {
    isSelected: boolean;
    shouldMount: boolean;
    contentProps: {
        role: 'tabpanel';
        id: string;
        'aria-labelledby': string;
        'data-state': "active" | "inactive";
        'data-orientation': TabsOrientation;
        hidden: boolean;
        tabIndex: number;
    };
};
//# sourceMappingURL=useTabs.d.ts.map