/**
 * `@tamagui/core/dom` and `tamagui/dom` on native.
 *
 * Same compile-only surface as web, plus the DOM primitives. Those are not for
 * user code: the compiler injects imports of them when it lowers a tag, which
 * is why `NATIVE_PRIMITIVE_MODULE` in `@tamagui/dom` names this entry.
 */

export {
  DOMImage,
  DOMRuntimeImage,
  DOMRuntimeText,
  DOMRuntimeTextInput,
  DOMRuntimeView,
  DOMText,
  DOMTextInput,
  DOMView,
  DOMViewportProvider,
  useViewportScale_DO_NOT_USE,
} from './primitives.native'
export type {
  CompiledStyle,
  ConditionalCompiledStyle,
  DOMStyleProps,
  StyleDefinition,
} from './standalone'
export { style } from './standalone'
export { html } from './standaloneHtml'
