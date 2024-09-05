type OptionalKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];
type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];
export type MergePreservingOptional<T, U> = {
    [K in RequiredKeys<T> | RequiredKeys<U>]: K extends keyof T ? K extends keyof U ? T[K] | U[K] : T[K] : K extends keyof U ? U[K] : never;
} & {
    [K in OptionalKeys<T> | OptionalKeys<U>]?: K extends keyof T ? K extends keyof U ? T[K] | U[K] : T[K] : K extends keyof U ? U[K] : never;
};
export {};
//# sourceMappingURL=type-utils.d.ts.map