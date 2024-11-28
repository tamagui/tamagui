export declare const copyToClipboard: (text: string) => Promise<void>;
export declare function useClipboard(text?: string, timeout?: number): {
    value: string;
    onCopy: () => Promise<void>;
    hasCopied: boolean;
    resetState: () => void;
};
//# sourceMappingURL=useClipboard.d.ts.map