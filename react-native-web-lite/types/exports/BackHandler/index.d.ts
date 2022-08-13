declare function emptyFunction(): void;
declare const BackHandler: {
    exitApp: typeof emptyFunction;
    addEventListener(): {
        remove: () => void;
    };
    removeEventListener: typeof emptyFunction;
};
export default BackHandler;
//# sourceMappingURL=index.d.ts.map