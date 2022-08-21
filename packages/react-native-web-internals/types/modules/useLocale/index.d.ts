declare type Locale = string;
declare type WritingDirection = 'ltr' | 'rtl';
declare type LocaleValue = {
    direction: WritingDirection;
    locale: Locale | null;
};
declare type ProviderProps = {
    children: any;
} & LocaleValue;
export declare function getLocaleDirection(locale: Locale): WritingDirection;
export declare function LocaleProvider(props: ProviderProps): any;
export declare function useLocaleContext(): LocaleValue;
export {};
//# sourceMappingURL=index.d.ts.map