declare type I18nManagerStatus = {
    allowRTL: (allowRTL: boolean) => void;
    forceRTL: (forceRTL: boolean) => void;
    getConstants: () => Constants;
};
declare type Constants = {
    isRTL: boolean;
};
declare const I18nManager: I18nManagerStatus;
export default I18nManager;
//# sourceMappingURL=index.d.ts.map