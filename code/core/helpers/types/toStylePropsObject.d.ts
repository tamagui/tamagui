type StylePropSource = string | Readonly<Record<string, boolean>> | undefined;
type StylePropWords<Value extends string> = Value extends `${infer A} ${infer B} ${infer C} ${infer D} ${infer E} ${infer F} ${infer G} ${infer H} ${infer Tail}` ? A | B | C | D | E | F | G | H | StylePropWords<Tail> : Value extends `${infer Head} ${infer Tail}` ? Head | StylePropWords<Tail> : Value;
type StylePropKeys<Source> = Source extends string ? StylePropWords<Source> : Source extends Readonly<Record<string, boolean>> ? keyof Source : never;
export declare const toStylePropsObject: <const Sources extends readonly StylePropSource[]>(...sources: Sources) => { [Key in Exclude<Extract<StylePropKeys<Sources[number]>, string>, ''>]: true; };
export {};
//# sourceMappingURL=toStylePropsObject.d.ts.map