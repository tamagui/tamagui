import { Text } from 'ink'
import zod from 'zod'

export const args = zod.tuple([zod.string(), zod.string()])

type Props = {
  args: zod.infer<typeof args>
}

// const categories = ['forms', 'elements', 'shells', 'animations', 'ecommerce', 'user']
export default function Add({ args }: Props) {
  // if `bento add` show Select with categories.
  // then show Select with category sections.
  // if `bento add <category>` show Select with category sections.
  return (
    <Text>
      Adding now {args[0]} to {args[1]}
    </Text>
  )
}
