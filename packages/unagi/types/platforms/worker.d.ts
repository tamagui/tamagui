declare global {
    var globalThis: {
        Oxygen: {
            env: any;
        };
        [key: string]: any;
    };
}
declare const _default: {
    fetch(request: Request, env: unknown, context: {
        waitUntil: (promise: Promise<any>) => void;
    }): Promise<Response>;
};
export default _default;
//# sourceMappingURL=worker.d.ts.map