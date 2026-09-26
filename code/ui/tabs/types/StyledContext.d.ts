import type { TabsProps } from './Tabs';
export type TabsContextValue = {
    baseId: string;
    value?: string;
    onChange: (value: string) => void;
    orientation?: TabsProps['orientation'];
    dir?: TabsProps['dir'];
    activationMode?: TabsProps['activationMode'];
    registerTrigger: () => void;
    unregisterTrigger: () => void;
    triggersCount: number;
};
export declare const TabsProvider: import("react").Provider<TabsContextValue> & import("react").ProviderExoticComponent<Partial<TabsContextValue> & {
    children?: import("react").ReactNode;
    scope?: string;
}>, useTabsContext: (scope?: string) => TabsContextValue;
//# sourceMappingURL=StyledContext.d.ts.map