import { SizableText, View, type SizableTextProps } from 'tamagui'
import { type LinkProps, useLinkTo } from 'one'
import { GithubIcon } from '~/features/icons/GithubIcon'
import { DiscordIcon } from '~/features/icons/DiscordIcon'

export const SocialLinksRow = () => {
  return (
    <>
      <HoverableLink
        mr={-3}
        target="_blank"
        href="https://x.com/one__js"
        aria-label="X (formerly Twitter)"
      >
        <svg
          style={{
            width: 36,
            height: 36,
            marginBottom: -7,
            marginTop: -1,
            marginLeft: -4,
            marginRight: -4,
          }}
          fillRule="evenodd"
          clipRule="evenodd"
          viewBox="0 0 512 509.64"
          aria-hidden="true"
        >
          <path
            fill="var(--logoColor)"
            fillRule="nonzero"
            d="M323.74 148.35h36.12l-78.91 90.2 92.83 122.73h-72.69l-56.93-74.43-65.15 74.43h-36.14l84.4-96.47-89.05-116.46h74.53l51.46 68.04 59.53-68.04zm-12.68 191.31h20.02l-129.2-170.82H180.4l130.66 170.82z"
          />
        </svg>
      </HoverableLink>

      <HoverableLink
        target="_blank"
        href="https://github.com/tamagui/tamagui"
        aria-label="GitHub"
      >
        <GithubIcon width={28} height={28} aria-hidden="true" />
      </HoverableLink>

      <View dsp="none" $group-card-gtXs={{ dsp: 'inline-flex' }}>
        <HoverableLink
          target="_blank"
          href="https://discord.gg/kJs5jeQp"
          aria-label="Discord"
        >
          <DiscordIcon width={28} height={28} aria-hidden="true" />
        </HoverableLink>
      </View>
    </>
  )
}

const HoverableLink = (props: SizableTextProps & LinkProps) => {
  const linkProps = useLinkTo({ href: props.href as any, replace: props.replace })

  return (
    <SizableText
      tag="a"
      cur="pointer"
      p="$2"
      px="$3"
      o={0.66}
      hoverStyle={{ o: 1 }}
      {...linkProps}
      {...props}
    />
  )
}
