type Locale = string;
type WritingDirection = 'ltr' | 'rtl';
type LocaleValue = {
    direction: WritingDirection;
    locale: Locale | null;
};
type ProviderProps = {
    children: any;
} & LocaleValue;
export declare function getLocaleDirection(locale: Locale): WritingDirection;
export declare function LocaleProvider(props: ProviderProps): any;
export declare function useLocaleContext(): LocaleValue;
export {};
//# sourceMappingURL=index.d.ts.map