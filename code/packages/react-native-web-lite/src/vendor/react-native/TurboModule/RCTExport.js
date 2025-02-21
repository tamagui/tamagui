
/**
 * NOTE: This is React Native specific export type.
 *
 * RCTExport is an interface type that allows native code generation for React
 * Native native modules. It exists as a hint to the codegen tool that any
 * interface that extends it needs to be codegen'ed. Example usage:
 *
 *   export interface RCTFoobar extends RCTExport<void> {}
 *
 * Native definition for RCTFoobar will then be generated.
 *
 * The type param T is a placeholder for future codegen hinting, like versioning
 * information, native base classes, etc. For now, simply use `void` type as
 * there's nothing to give hint about.
 */
// eslint-disable-next-line no-unused-vars
