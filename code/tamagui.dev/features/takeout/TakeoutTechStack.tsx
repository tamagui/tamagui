import { H2, H3, Paragraph, styled, XStack, YStack } from 'tamagui'
import { TamaguiLogo, ThemeTintAlt } from '@tamagui/logo'

import { Link } from '~/components/Link'
import { HighlightText } from './HighlightText'

// One logo - based on takeout3-new reference
const OneLogo = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 590 590" fill="none">
    <defs>
      <filter
        x="-93.3%"
        y="-81.2%"
        width="286.7%"
        height="262.4%"
        filterUnits="objectBoundingBox"
        id="one-filter-1"
      >
        <feGaussianBlur stdDeviation="22" in="SourceGraphic" />
      </filter>
      <filter
        x="-13.5%"
        y="-46.9%"
        width="126.9%"
        height="193.8%"
        filterUnits="objectBoundingBox"
        id="one-filter-2"
      >
        <feGaussianBlur stdDeviation="20" in="SourceGraphic" />
      </filter>
      <filter
        x="-23.9%"
        y="-22.5%"
        width="147.8%"
        height="145.1%"
        filterUnits="objectBoundingBox"
        id="one-filter-3"
      >
        <feGaussianBlur stdDeviation="41" in="SourceGraphic" />
      </filter>
    </defs>
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g fillRule="nonzero">
        <circle fill="#F5CA05" cx="295" cy="295" r="295" />
        <circle fill="#FFFFFF" cx="311" cy="230" r="110" />
        <path
          d="M299.32294,286 L339.7951,281.25 C342.598367,279.138889 344,276.324074 344,272.805556 C344,269.287037 342.247958,267 338.743875,265.944444 L329.282851,265.944444 L321.398664,178.333333 C320.347439,173.055556 318.244989,172 312.988864,172 C307.732739,172 305.63029,173.583333 304.053452,175.166667 C302.476615,176.75 302.476615,182.555556 301.951002,183.611111 C301.42539,184.666667 291.438753,188.361111 287.759465,189.944444 C284.080178,191.527778 284.080178,201.555556 287.759465,203.666667 C291.438753,205.777778 298.271715,202.083333 301.42539,204.722222 L307.207127,267.527778 C299.339925,268.871363 294.784617,270.102844 293.541203,271.222222 C291.676081,272.901289 290.91314,274.388889 291.438753,279.666667 C291.789161,283.185185 294.417223,285.296296 299.32294,286 Z"
          fill="#000000"
        />
        <ellipse
          fill="#FFFFFF"
          opacity="0.453031994"
          filter="url(#one-filter-1)"
          transform="translate(200.0089, 137.737) rotate(46) translate(-200.0089, -137.737)"
          cx="200.008945"
          cy="137.73703"
          rx="35.3577818"
          ry="40.6350626"
        />
        <path
          d="M521,138 C482.503431,98.2196247 448.723549,71.1799277 419.660355,56.880909 C376.065564,35.432381 347.543959,28.4841486 295.097041,26.8563104 C242.650124,25.2284722 225.598176,37.942459 183.728994,56.880909 C155.816206,69.5065424 119.573208,92.6834255 75,126.411558 C102.798028,89.5392443 133.411045,63.0262947 166.839053,46.8727095 C216.981065,22.6423316 259.733728,10 295.097041,10 C330.460355,10 373.740828,20.0085949 428.633136,46.8727095 C465.228008,64.7821192 496.016963,95.1578827 521,138 Z"
          fill="#FFFFFF"
          opacity="0.773065476"
          filter="url(#one-filter-2)"
        />
        <path
          d="M361.057245,44 C431.694309,123.939704 467.935264,174.984191 469.780109,197.133462 C472.547375,230.357369 482.654123,254.819372 459.752272,321.224371 C436.85042,387.629371 415.418677,407.823985 383.224042,440.562863 C361.760952,462.388781 259.019605,478.230174 75,488.087041 C207.883501,556.029014 286.171,590 309.862498,590 C333.553996,590 368.739389,581.727273 415.418677,565.181818 C481.196175,535.021945 525.881624,499.994866 549.475024,460.10058 C584.865123,400.259152 591.955643,340.867492 589.586372,292.181818 C587.2171,243.496144 582.366118,196.314838 555.280613,172.31528 C537.223611,156.315576 472.482488,113.543815 361.057245,44 Z"
          fill="#000000"
          opacity="0.0963076637"
          filter="url(#one-filter-3)"
        />
      </g>
    </g>
  </svg>
)

// Zero logo
const ZeroLogo = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="40" stroke="var(--blue10)" strokeWidth="8" fill="none" />
    <circle cx="50" cy="50" r="20" stroke="var(--blue10)" strokeWidth="6" fill="none" />
  </svg>
)

const TechCard = styled(YStack, {
  bg: '$background',
  rounded: '$8',
  p: '$6',
  borderWidth: 0.5,
  borderColor: '$borderColor',
  flex: 1,
  minW: 260,
  maxW: 340,
  cursor: 'pointer',
  overflow: 'hidden',
  position: 'relative',
  style: {
    transition: 'all 200ms ease',
    backdropFilter: 'blur(12px)',
  },

  hoverStyle: {
    borderColor: '$color6',
    y: -4,
  },

  $md: {
    minW: 300,
    maxW: 360,
  },
})

const LogoWrapper = styled(YStack, {
  width: 56,
  height: 56,
  rounded: '$5',
  items: 'center',
  justify: 'center',
  mb: '$4',
})

const Badge = styled(YStack, {
  px: '$3',
  py: '$1',
  rounded: '$10',
  self: 'flex-start',
})

const techStack = [
  {
    name: 'Tamagui',
    badge: 'UI System',
    description:
      'Universal design system with an optimizing compiler. Write styles once, run everywhere with native performance. Includes a full UI kit.',
    url: 'https://tamagui.dev',
    highlight: 'v2 RC1 Released',
    Logo: TamaguiLogo,
    color: '$yellow10',
    bgColor: 'rgba(236, 210, 10, 0.1)',
  },
  {
    name: 'One',
    badge: 'Framework',
    description:
      'Vite-powered universal React framework. Typed file-based routing, loaders, SSR, SSG, SPA and API routes. Deploys anywhere with a single command.',
    url: 'https://onestack.dev',
    highlight: 'v1 RC1 Released',
    Logo: OneLogo,
    color: '$yellow10',
    bgColor: 'rgba(245, 202, 5, 0.1)',
  },
  {
    name: 'Zero',
    badge: 'Sync Engine',
    description:
      'The next-generation way to handle data. Build truly native-feeling apps easier than ever, sharing every piece of code between native and web.',
    url: 'https://zero.rocicorp.dev',
    highlight: 'Instant sync',
    Logo: ZeroLogo,
    color: '$blue10',
    bgColor: 'rgba(59, 130, 246, 0.1)',
  },
]

const additionalTools = [
  { name: 'Better Auth', description: 'Type-safe authentication' },
  { name: 'Valibot', description: 'Fast schema validation' },
  { name: 'SST', description: 'AWS infrastructure as code' },
  { name: 'Drizzle', description: 'Type-safe SQL ORM' },
  { name: 'PostHog', description: 'Analytics & feature flags' },
  { name: 'Expo', description: 'Native iOS & Android' },
]

export function TakeoutTechStack() {
  return (
    <YStack gap="$6" py="$8" px="$4" maxW={1200} self="center" width="100%">
      <YStack items="center" gap="$4">
        <H2
          fontSize={32}
          fontWeight="700"
          text="center"
          color="$color12"
          style={{ lineHeight: '1.2' }}
          $sm={{ fontSize: 40 }}
        >
          A brand new{' '}
          <ThemeTintAlt offset={-1}>
            <HighlightText render="span">stack</HighlightText>
          </ThemeTintAlt>
        </H2>
        <Paragraph
          fontSize={16}
          color="$color11"
          text="center"
          maxW={500}
          style={{ lineHeight: '1.6' }}
          $sm={{ fontSize: 18 }}
        >
          Combining three libraries aimed at solving cross-platform in the best way
          possible, in a refined and cohesive whole.
        </Paragraph>
      </YStack>

      <XStack flexWrap="wrap" gap="$5" justify="center" $md={{ flexWrap: 'nowrap' }}>
        {techStack.map((tech) => (
          <Link key={tech.name} href={tech.url as any} target="_blank">
            <TechCard>
              <LogoWrapper bg={tech.bgColor as any}>
                <tech.Logo size={32} />
              </LogoWrapper>

              <Badge bg={tech.bgColor as any} mb="$3">
                <Paragraph fontSize={12} color={tech.color as any} fontWeight="600">
                  {tech.badge}
                </Paragraph>
              </Badge>

              <H3
                fontSize={18}
                fontWeight="600"
                color="$color12"
                mb="$2"
                style={{ lineHeight: '1.3' }}
              >
                {tech.name}
              </H3>

              <Paragraph
                fontSize={14}
                color="$color11"
                mb="$4"
                style={{ lineHeight: '1.6' }}
              >
                {tech.description}
              </Paragraph>

              <XStack items="center" gap="$2" mt="auto">
                <YStack width={6} height={6} rounded={999} bg="$green10" />
                <Paragraph fontSize={12} color="$green10" fontWeight="600">
                  {tech.highlight}
                </Paragraph>
              </XStack>

              {/* decorative gradient orb */}
              {/* <YStack
                position="absolute"
                t={-30}
                r={-30}
                width={100}
                height={100}
                rounded={999}
                bg={tech.color as any}
                opacity={0.06}
              /> */}
            </TechCard>
          </Link>
        ))}
      </XStack>

      {/* <YStack gap="$4" mt="$6">
        <Paragraph
          fontSize={16}
          fontWeight="600"
          text="center"
          color="$color11"
          style={{ lineHeight: '1.4' }}
        >
          Plus everything else you need
        </Paragraph>

        <XStack flexWrap="wrap" gap="$3" justify="center" maxW={900} self="center">
          {additionalTools.map((tool) => (
            <YStack
              key={tool.name}
              bg="$color2"
              px="$4"
              py="$2.5"
              rounded="$4"
              borderWidth={1}
              borderColor="$color4"
            >
              <Paragraph
                fontSize={14}
                color="$color12"
                fontWeight="500"
                style={{ lineHeight: '1.4' }}
              >
                {tool.name}
              </Paragraph>
              <Paragraph fontSize={12} color="$color10" style={{ lineHeight: '1.4' }}>
                {tool.description}
              </Paragraph>
            </YStack>
          ))}
        </XStack>
      </YStack> */}
    </YStack>
  )
}
