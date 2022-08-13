declare type Content = {
    title?: string;
    message?: string;
    url: string;
} | {
    title?: string;
    message: string;
    url?: string;
};
declare class Share {
    static share(content: Content, options?: Object): Promise<void>;
    static get sharedAction(): string;
    static get dismissedAction(): string;
}
export default Share;
//# sourceMappingURL=index.d.ts.map