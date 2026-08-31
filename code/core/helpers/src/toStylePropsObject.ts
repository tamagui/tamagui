type StylePropSource = string | Readonly<Record<string, boolean>> | undefined
type StylePropWords<Value extends string> = Value extends `${infer Head} ${infer Tail}`
  ? Head | StylePropWords<Tail>
  : Value
type StylePropKeys<Source> = Source extends string
  ? StylePropWords<Source>
  : Source extends Readonly<Record<string, boolean>>
    ? keyof Source
    : never

export const toStylePropsObject = <const Sources extends readonly StylePropSource[]>(
  ...sources: Sources
): { [Key in Extract<StylePropKeys<Sources[number]>, string>]: true } => {
  const out: Record<string, boolean> = {}
  for (const source of sources) {
    if (!source) continue
    for (const key of typeof source === 'string'
      ? source.split(' ')
      : Object.keys(source)) {
      if (key) out[key] = true
    }
  }
  return out as { [Key in Extract<StylePropKeys<Sources[number]>, string>]: true }
}
