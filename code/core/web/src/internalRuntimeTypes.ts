/**
 * The narrow type surface another style frontend needs to build components on the
 * shared runtime.
 *
 * Deliberately excluded: `StackStyle`, `TextStyle`, and everything they pull in
 * (shorthands, pseudo/media/theme style props, recursive variant prop graphs). A
 * frontend that instantiated those would inherit core's inline authoring syntax,
 * which is exactly what package isolation exists to prevent.
 */
export type { StyleFrontend } from './helpers/styleFrontend'

export type {
  GenericVariantDefinitions,
  StackNonStyleProps,
  StaticConfig,
  StaticConfigPublic,
  StylableComponent,
  TamaguiElement,
  TamaguiInternalConfig,
  TamaguiTextElement,
  TextNonStyleProps,
  VariantSpreadFunction,
} from './types'
