export declare type DevServerMessage = {
    type: 'warn';
    data: string;
} | {
    type: 'error';
    data: {
        message: string;
        stack: string;
    };
};
export declare function sendMessageToClient(client: "browser-console" | "dev-tools" | undefined, payload: DevServerMessage): void;
//# sourceMappingURL=devtools.d.ts.map