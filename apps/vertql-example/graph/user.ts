/**
 * Test comment
 * @gqlType */
type Query = {}

/** @gqlField */
export function greet(query: Query, args: { greeting: string }): string {
  return `hello ${args.greeting}`
}
