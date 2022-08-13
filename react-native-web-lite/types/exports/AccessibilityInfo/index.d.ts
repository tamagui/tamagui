declare function isScreenReaderEnabled(): Promise<unknown>;
declare function isReduceMotionEnabled(): Promise<unknown>;
declare const AccessibilityInfo: {
    isScreenReaderEnabled: typeof isScreenReaderEnabled;
    isReduceMotionEnabled: typeof isReduceMotionEnabled;
    fetch: typeof isScreenReaderEnabled;
    addEventListener: (eventName: string, handler: Function) => any;
    setAccessibilityFocus: (reactTag: number) => void;
    announceForAccessibility: (announcement: string) => void;
    removeEventListener: (eventName: string, handler: Function) => void;
};
export default AccessibilityInfo;
//# sourceMappingURL=index.d.ts.map