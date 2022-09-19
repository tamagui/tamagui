export { renderToPipeableStream as ssrRenderToPipeableStream, // Only available in Node context
renderToReadableStream as ssrRenderToReadableStream, } from 'react-dom/server';
declare type ServerContextJSONValue = string | boolean | number | null | Readonly<ServerContextJSONValueCircular> | {
    [key: string]: ServerContextJSONValueCircular;
};
interface ServerContextJSONValueCircular extends Array<ServerContextJSONValue> {
}
export declare const rscRenderToReadableStream: (App: JSX.Element, options?: {
    onError?: ((error: Error) => void) | undefined;
    context?: [string, ServerContextJSONValue][] | undefined;
    identifierPrefix?: string | undefined;
} | undefined) => ReadableStream<Uint8Array>;
export declare const createFromReadableStream: (rs: ReadableStream<Uint8Array>) => {
    readRoot: () => JSX.Element;
};
export declare function bufferReadableStream(reader: ReadableStreamDefaultReader, cb?: (chunk: string) => void): Promise<string>;
//# sourceMappingURL=streaming.server.d.ts.map