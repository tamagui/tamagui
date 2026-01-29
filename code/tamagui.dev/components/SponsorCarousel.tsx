import { H2, H5, Paragraph, styled, XStack, YStack, Image } from 'tamagui'
import { Link } from '~/components/Link'

const sponsors = [
  {
    id: 'uniswap',
    name: 'Uniswap',
    link: 'https://uniswap.org',
    image: '/sponsors/uniswap.png',
    gradient: 'linear-gradient(135deg, #FCF6FA 0%, #FED2E5 100%)',
  },
  {
    id: 'granted',
    name: 'Granted',
    link: 'https://grantedhealth.com',
    image: '/sponsors/granted.png',
    gradient: 'linear-gradient(135deg, #FAFFF5 0%,#E7F0B9 100%)',
  },
  {
    id: 'healthy',
    name: 'Healthy',
    link: 'https://gethealthy.com',
    image: '/sponsors/healthy.png',
    gradient: 'linear-gradient(135deg, #84CAC3 0%,#306C75 100%)',
  },
  {
    id: 'appfolio',
    name: 'AppFolio',
    link: 'https://www.appfolio.com',
    image: '/sponsors/appfolio.png',
    gradient: 'linear-gradient(135deg, #0084FF 0%, #0055CC 100%)',
  },
  {
    id: 'bounty',
    name: 'Bounty',
    link: 'https://bounty.co',
    image: '/sponsors/bounty.png',
    gradient: 'linear-gradient(135deg, #1FA2FF 0%, #12D8FA 0%, #A6FFCB 100%)',
  },
  {
    id: 'meteor',
    name: 'Meteor',
    link: 'https://meteorwallet.app',
    image: '/sponsors/meteor.png',
    gradient: 'linear-gradient(135deg, #060230 0%, #2E4679 100%)',
  },
  {
    id: 'beatgig',
    name: 'BeatGig',
    link: 'https://beatgig.com',
    image: '/sponsors/beatgig.png',
    gradient: 'linear-gradient(135deg, #221508 0%, #BE8A06 100%)',
  },
  {
    id: 'codingscape',
    name: 'CodingScape',
    link: 'https://codingscape.com',
    image: '/sponsors/coding-scape.png',
    gradient: 'linear-gradient(135deg, #474B57 0%, #161D2D 0%, #121620 100%)',
  },
  {
    id: 'questportal',
    name: 'Quest Portal',
    link: 'https://www.questportal.com',
    image: '/sponsors/quest-portal.png',
    gradient: 'linear-gradient(135deg, #45315C 0%, #0C0118 100%)',
  },
  {
    id: 'pineapples',
    name: 'Pineapples.dev',
    link: 'http://pineapples.dev',
    image: '/sponsors/pineapple.png',
    gradient: 'linear-gradient(135deg, #FFF1B9 0%, #FACC14 100%)',
  },
  {
    id: 'barelyreaper',
    name: '@barelyreaper',
    link: 'https://x.com/barelyreaper',
  },
  {
    id: 'pontusab',
    name: '@pontusab',
    link: 'https://x.com/pontusab',
  },
  {
    id: 'antelabrais',
    name: '@AntelaBrais',
    link: 'https://x.com/AntelaBrais',
  },
  {
    id: 'hirbod',
    name: 'Hirbod',
    link: 'https://x.com/nightstomp',
  },
  {
    id: 'dimension',
    name: 'Dimension',
    link: 'https://x.com/joindimension',
  },
]

const CarouselWrapper = styled(YStack, {
  width: '100%',
  position: 'relative',
  my: '$8',
})

const CarouselContainer = styled(YStack, {
  width: '100%',
  position: 'relative',
  gap: '$4',
  py: '$4',
  items: 'center',
})

const SponsorCardStyled = styled(YStack, {
  width: 220,
  height: 220,
  rounded: '$6',
  overflow: 'visible',
  position: 'relative',
  shrink: 0,
  cursor: 'pointer',
})

const SponsorContent = styled(YStack, {
  width: '100%',
  height: '100%',
  p: '$3',
  justify: 'space-between',
})

const LogoContainer = styled(YStack, {
  items: 'center',
  justify: 'center',
  flex: 1,
  rounded: '$4',
  p: '$2',
  position: 'relative',
  width: '100%',
  height: '100%',
  transition: 'quick',
  hoverStyle: {
    scale: 1.15,
  },
  pressStyle: {
    scale: 0.95,
  },
})

export function SponsorCarousel() {
  return (
    <CarouselWrapper>
      <CarouselContainer>
        {/* Title section */}
        <YStack mb="$4">
          <H2 size="$10" text="center" color="$color">
            Our Sponsors
          </H2>
          <Paragraph text="center" color="$color10" size="$5" mt="$2">
            Sponsors who made Tamagui possible
          </Paragraph>
        </YStack>
        <XStack flexWrap="wrap" justify="center" gap="$6" px="$6" maxW={1200}>
          {sponsors.map((sponsor) => (
            <SponsorCard key={sponsor.id} {...sponsor} />
          ))}
        </XStack>
      </CarouselContainer>
    </CarouselWrapper>
  )
}

function SponsorCard({ link, image, gradient, name }: (typeof sponsors)[0]) {
  const isIndividual = !image

  return (
    <Link href={link as any} target="_blank" style={{ textDecoration: 'none' }}>
      <SponsorCardStyled
        background={gradient || '$background'}
        borderWidth={isIndividual ? 1 : 0}
        borderColor={isIndividual ? '$gray6' : 'transparent'}
      >
        <SponsorContent>
          <LogoContainer>
            {image ? (
              <Image
                src={image}
                width={120}
                height={120}
                style={{ objectFit: 'contain' }}
                alt={name}
              />
            ) : (
              <YStack
                cursor="pointer"
                p="$2"
                rounded="$4"
                hoverStyle={{ bg: 'rgba(0,0,0,0.1)' }}
                pressStyle={{ bg: 'rgba(0,0,0,0.2)' }}
                gap="$4"
              >
                <H5 cursor="inherit" self="center" items="center">
                  {name}
                </H5>
              </YStack>
            )}
          </LogoContainer>
        </SponsorContent>
      </SponsorCardStyled>
    </Link>
  )
}
