import type { FastifyLoggerInstance } from 'fastify';
import { SourceMapConsumer } from 'source-map';
import type { ReactNativeStackFrame, SymbolicatorDelegate, SymbolicatorResults } from './types';
/**
 * Class for transforming stack traces from React Native application with using Source Map.
 * Raw stack frames produced by React Native, points to some location from the bundle
 * eg `index.bundle?platform=ios:567:1234`. By using Source Map for that bundle `Symbolicator`
 * produces frames that point to source code inside your project eg `Hello.tsx:10:9`.
 */
export declare class Symbolicator {
    private delegate;
    /**
     * Infer platform from stack frames.
     * Usually at least one frame has `file` field with the bundle URL eg:
     * `http://localhost:8081/index.bundle?platform=ios&...`, which can be used to infer platform.
     *
     * @param stack Array of stack frames.
     * @returns Inferred platform or `undefined` if cannot infer.
     */
    static inferPlatformFromStack(stack: ReactNativeStackFrame[]): string | undefined;
    /**
     * Cache with initialized `SourceMapConsumer` to improve symbolication performance.
     */
    sourceMapConsumerCache: Record<string, SourceMapConsumer>;
    /**
     * Constructs new `Symbolicator` instance.
     *
     * @param delegate Delegate instance with symbolication functions.
     */
    constructor(delegate: SymbolicatorDelegate);
    /**
     * Process raw React Native stack frames and transform them using Source Maps.
     * Method will try to symbolicate as much data as possible, but if the Source Maps
     * are not available, invalid or the original positions/data is not found in Source Maps,
     * the method will return raw values - the same as supplied with `stack` parameter.
     * For example out of 10 frames, it's possible that only first 7 will be symbolicated and the
     * remaining 3 will be unchanged.
     *
     * @param logger Fastify logger instance.
     * @param stack Raw stack frames.
     * @returns Symbolicated stack frames.
     */
    process(logger: FastifyLoggerInstance, stack: ReactNativeStackFrame[]): Promise<SymbolicatorResults>;
    private processFrame;
    private getCodeFrame;
}
//# sourceMappingURL=Symbolicator.d.ts.map