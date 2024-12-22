import { Link2 } from '@tamagui/lucide-icons'
import { View } from 'tamagui'

export const LinkHeading = ({ id, children, ...props }: { id: string } & XStackProps) => (
  <View
    flexDirection="row"
    tag="a"
    className="text-underline-none"
    style={{ textDecoration: 'none' }}
    href={`#${id}`}
    id={id}
    data-id={id}
    display="inline-flex"
    ai="center"
    gap="$4"
    {...props}
  >
    {children}
    <View tag="span" opacity={0.3}>
      <Link2 size={16} color="var(--color)" aria-hidden />
    </View>
  </View>
)
