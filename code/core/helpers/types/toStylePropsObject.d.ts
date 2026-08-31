type StylePropSource = string | Readonly<Record<string, boolean>> | undefined;
type StylePropWords<Value extends string> = Value extends `${infer Head} ${infer Tail}` ? Head | StylePropWords<Tail> : Value;
type StylePropKeys<Source> = Source extends string ? StylePropWords<Source> : Source extends Readonly<Record<string, boolean>> ? keyof Source : never;
export declare const toStylePropsObject: <const Sources extends readonly StylePropSource[]>(...sources: Sources) => { [Key in Extract<StylePropKeys<Sources[number]>, string>]: true; };
export {};
//# sourceMappingURL=toStylePropsObject.d.ts.map