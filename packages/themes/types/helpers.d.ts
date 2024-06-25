type ObjectType = Record<PropertyKey, unknown>;
type PickByValue<OBJ_T, VALUE_T> = Pick<OBJ_T, {
    [K in keyof OBJ_T]: OBJ_T[K] extends VALUE_T ? K : never;
}[keyof OBJ_T]>;
type ObjectEntries<OBJ_T> = {
    [K in keyof OBJ_T]: [keyof PickByValue<OBJ_T, OBJ_T[K]>, OBJ_T[K]];
}[keyof OBJ_T][];
export declare const objectKeys: <O extends Object>(obj: O) => Array<keyof O>;
export declare function objectEntries<OBJ_T extends ObjectType>(obj: OBJ_T): ObjectEntries<OBJ_T>;
type EntriesType = [PropertyKey, unknown][] | ReadonlyArray<readonly [PropertyKey, unknown]>;
type DeepWritable<OBJ_T> = {
    -readonly [P in keyof OBJ_T]: DeepWritable<OBJ_T[P]>;
};
type UnionToIntersection<UNION_T> = (UNION_T extends any ? (k: UNION_T) => void : never) extends (k: infer I) => void ? I : never;
type UnionObjectFromArrayOfPairs<ARR_T extends EntriesType> = DeepWritable<ARR_T> extends (infer R)[] ? R extends [infer key, infer val] ? {
    [prop in key & PropertyKey]: val;
} : never : never;
type MergeIntersectingObjects<ObjT> = {
    [key in keyof ObjT]: ObjT[key];
};
type EntriesToObject<ARR_T extends EntriesType> = MergeIntersectingObjects<UnionToIntersection<UnionObjectFromArrayOfPairs<ARR_T>>>;
export declare function objectFromEntries<ARR_T extends EntriesType>(arr: ARR_T): EntriesToObject<ARR_T>;
export {};
//# sourceMappingURL=helpers.d.ts.map