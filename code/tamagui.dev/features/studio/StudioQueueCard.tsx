import { LogoIcon } from '@tamagui/logo'
import { useEffect, useState } from 'react'
import { Paragraph, Spacer, Spinner, XStack, YStack, composeRefs } from 'tamagui'
import { useHoverGlow } from '~/components/HoverGlow'

export const StudioQueueCard = ({ teamId }: { teamId: number }) => {
  const [teamData, setTeamData] = useState<any>(null)

  useEffect(() => {
    const main = async () => {
      const res = await fetch(`/api/studio-queue?team_id=${teamId}`)
      const data = await res.json()
      setTeamData(data)
    }

    main()
  }, [])

  if (!teamData) {
    return <Spinner />
  }

  return (
    <QueueCardFrame
      teamName={teamData.name}
      place={teamData.place}
      date={new Date(teamData.date)}
      estimatedDate={teamData.estimatedDate}
      tierName={teamData.tierName}
      tierId={teamData.tierId}
    />
  )
}

const QueueCardFrame = ({
  place,
  tierName,
  estimatedDate,
  teamName,
}: {
  teamName: string
  place: number
  date: Date
  estimatedDate: string
  tierName: string
  tierId: string
}) => {
  const glow = useHoverGlow({
    resist: 65,
    size: 500,
    strategy: 'blur',
    blurPct: 100,
    color: 'var(--color10)',
    opacity: 0.3,
    background: 'transparent',
    offset: {
      x: -200,
      y: 200,
    },
  })

  const glow2 = useHoverGlow({
    resist: 80,
    inverse: true,
    size: 500,
    strategy: 'blur',
    blurPct: 100,
    color: 'var(--blue10)',
    opacity: 0.3,
    background: 'transparent',
    offset: {
      x: 200,
      y: -200,
    },
  })

  const glow3 = useHoverGlow({
    resist: 80,
    size: 500,
    strategy: 'blur',
    blurPct: 100,
    color: 'var(--pink10)',
    opacity: 0.3,
    background: 'transparent',
    offset: {
      x: -200,
      y: -200,
    },
  })

  return (
    <YStack
      ref={composeRefs(
        glow.parentRef as any,
        glow2.parentRef as any,
        glow3.parentRef as any
      )}
      p="$4"
      br="$4"
      bw={4}
      bc="$color2"
      w={480}
      h={280}
      als="center"
      ov="hidden"
      elevation="$4"
    >
      <YStack fullscreen br={7} bw={1} bc="$borderColor" />

      <YStack className="rotate-slow-right">{glow.Component()}</YStack>
      <YStack className="rotate-slow-left">{glow2.Component()}</YStack>
      <YStack className="rotate-slow-right">{glow3.Component()}</YStack>

      {[
        5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
      ].map((deg) => (
        <YStack
          key={deg}
          pos="absolute"
          rotate={`${deg}deg`}
          t="$5"
          l="$5"
          r="$5"
          b="$5"
          br="$3"
          bc="$color8"
          o={0.2}
          bw={1}
          scale={1.3}
        />
      ))}

      <YStack>
        <Paragraph size="$8">{teamName}</Paragraph>
        <Paragraph size="$4">Studio Access</Paragraph>

        <Paragraph theme="alt2" size="$3">
          In queue for access {estimatedDate}
        </Paragraph>
      </YStack>

      <Spacer flex />

      <Paragraph pos="absolute" size="$12" b="$6" l="$15" scale={4} o={0.015} fow="900">
        {place}
      </Paragraph>

      <XStack pb="$1" ai="flex-end">
        <Paragraph als="flex-start" mr="$1" size="$6" o={0.35} ml="$-1">
          #
        </Paragraph>
        <Paragraph my="$-3" size="$12" fow="900">
          {place}
        </Paragraph>
        <Paragraph ml="$3" theme="alt2">
          in the {tierName ?? 'non-sponsor'} tier
        </Paragraph>

        <Spacer flex />

        <YStack pb="$2">
          <LogoIcon />
        </YStack>
      </XStack>
    </YStack>
  )
}
