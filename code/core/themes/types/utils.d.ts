export declare function postfixObjKeys<A extends {
    [key: string]: string;
}, B extends string>(obj: A, postfix: B): {
    [Key in `${keyof A extends string ? keyof A : never}${B}`]: string;
};
export declare function sizeToSpace(v: number): number;
export declare function objectFromEntries<ARR_T extends EntriesType>(arr: ARR_T): EntriesToObject<ARR_T>;
export type EntriesType = [PropertyKey, unknown][] | ReadonlyArray<readonly [PropertyKey, unknown]>;
export type DeepWritable<OBJ_T> = {
    -readonly [P in keyof OBJ_T]: DeepWritable<OBJ_T[P]>;
};
export type UnionToIntersection<UNION_T> = (UNION_T extends any ? (k: UNION_T) => void : never) extends (k: infer I) => void ? I : never;
export type UnionObjectFromArrayOfPairs<ARR_T extends EntriesType> = DeepWritable<ARR_T> extends (infer R)[] ? R extends [infer key, infer val] ? {
    [prop in key & PropertyKey]: val;
} : never : never;
export type MergeIntersectingObjects<ObjT> = {
    [key in keyof ObjT]: ObjT[key];
};
export type EntriesToObject<ARR_T extends EntriesType> = MergeIntersectingObjects<UnionToIntersection<UnionObjectFromArrayOfPairs<ARR_T>>>;
export declare function objectKeys<O extends Object>(obj: O): Array<keyof O>;
//# sourceMappingURL=utils.d.ts.map