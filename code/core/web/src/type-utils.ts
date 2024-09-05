// Extracts the keys of an object where the properties are optional
type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never
}[keyof T]

// Extracts the keys of an object where the properties are required
type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K
}[keyof T]

// Type to merge two objects
export type MergePreservingOptional<T, U> = {
  // Required properties
  [K in RequiredKeys<T> | RequiredKeys<U>]: K extends keyof T
    ? K extends keyof U
      ? T[K] | U[K] // Overlapping keys use a union type
      : T[K] // Non-overlapping keys retain their original type
    : K extends keyof U
      ? U[K]
      : never
} & {
  // Optional properties
  [K in OptionalKeys<T> | OptionalKeys<U>]?: K extends keyof T
    ? K extends keyof U
      ? T[K] | U[K] // Overlapping keys use a union type
      : T[K] // Non-overlapping keys retain their original type
    : K extends keyof U
      ? U[K]
      : never
}
