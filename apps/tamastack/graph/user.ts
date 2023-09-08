/**
 * A user in our kick-ass system!
 * @gqlType */
type User = {
  /** @gqlField */
  name: string
}

/** @gqlField */
export function greet(user: User, args: { greeting: string }): string {
  return `${args.greeting}, ${user.name}`
}
