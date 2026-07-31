import type { GetStyleState, SplitStyleProps } from '../types';
/**
 * native: resolves embedded legacy $tokens inside compound value strings.
 *
 * This deliberately does NOT parse boxShadow/textShadow/backgroundImage into
 * RN object format anymore: those strings flow WHOLE into the program engine
 * (clause-free strings are base-only programs) and the evaluator parses the
 * winning payload AFTER clause evaluation — parsing here mangled clause text
 * into the last component (review P0-2, third occurrence of the shape).
 *
 * A token resolving to a non-primitive (DynamicColorIOS) stays literal rather
 * than stringifying to "[object Object]": the value then visibly fails to
 * resolve instead of silently corrupting the output.
 */
export declare function platformResolveValue(key: string, value: string, styleProps: SplitStyleProps, styleState: Partial<GetStyleState>): any;
//# sourceMappingURL=platformResolveValue.native.d.ts.map