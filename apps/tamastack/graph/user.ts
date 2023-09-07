/** @gqlType */
class Query {
  /** @gqlField */
  hello(args: { name: string }): string {
    return `Hello ${args.name}!`
  }
}
