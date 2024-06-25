import * as Preferences from '../../components/user/preferences';
type Props = ReturnType<typeof preferencesGetComponentCodes>;
export declare function preferences(props: Props): import("react/jsx-runtime").JSX.Element;
export declare function preferencesGetComponentCodes(): {
    codes: Omit<Record<keyof typeof Preferences, string>, "getCode">;
};
export {};
//# sourceMappingURL=preferences.d.ts.map