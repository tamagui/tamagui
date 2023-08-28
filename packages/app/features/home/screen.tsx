import {
  AchievementCard,
  Banner,
  Button,
  EventCard,
  FeedCard,
  H2,
  H4,
  OverviewCard,
  Paragraph,
  ScrollView,
  Separator,
  Theme,
  TodoCard,
  XStack,
  YStack,
  isWeb,
  useMedia,
} from '@my/ui'
import { ArrowRight, DollarSign, Edit2, User, Users } from '@tamagui/lucide-icons'
import { api } from 'app/utils/api'
import React from 'react'
import { useLink } from 'solito/link'

const defaultAuthors = [
  {
    id: 1,
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=67/32/32?ca=1',
  },
  {
    id: 2,
    name: 'Jane Doe',
    avatar: 'https://i.pravatar.cc/150?img=30/32/32?ca=1',
  },
]

export function HomeScreen() {
  return (
    <XStack maw={1480} als="center" f={1}>
      <ScrollView f={3} fb={0}>
        <YStack gap="$6" pt="$5" pb="$8">
          <Greetings />
          <YStack gap="$8">
            <AchievementsSection />
            <OverviewSection />
            <PostsSection />
          </YStack>
        </YStack>
      </ScrollView>

      <Separator vertical />
      {/* eslint-disable react-hooks/rules-of-hooks */}
      {isWeb && (
        <ScrollView f={1} fb={0} $md={{ display: 'none' }}>
          <YStack separator={<Separator />}>
            <YStack>
              <EventCard
                title="Event #1"
                description="Lorem ipsum dolor sit, amet."
                action={{
                  text: 'Show Event',
                  props: useLink({ href: '/' }),
                }}
                tags={[
                  { text: 'New', theme: 'green_alt2' },
                  { text: 'Hot', theme: 'orange_alt2' },
                ]}
              />
              <EventCard
                title="Event #2"
                description="Lorem ipsum dolor sit, amet."
                action={{
                  text: 'Show Event',
                  props: useLink({ href: '/' }),
                }}
                tags={[{ text: '1 Day Remaining', theme: 'blue_alt2' }]}
              />
              <EventCard
                title="Event #3"
                description="Lorem ipsum dolor sit, amet."
                action={{
                  text: 'Show Event',
                  props: useLink({ href: '/' }),
                }}
                tags={[{ text: 'Ongoing', theme: 'alt1' }]}
              />
              <EventCard
                title="Event #4"
                description="Lorem ipsum dolor sit, amet."
                action={{
                  text: 'Show Event',
                  props: useLink({ href: '/' }),
                }}
                tags={[{ text: 'Finished', theme: 'alt2' }]}
              />
            </YStack>
            <YStack p="$3">
              <Theme name="blue_alt1">
                <Banner {...useLink({ href: '/' })} cursor="pointer">
                  <H4>Upgrade Now!</H4>
                  <Paragraph size="$2" mt="$1">
                    Upgrade to access exclusive features and more!
                  </Paragraph>
                </Banner>
              </Theme>
            </YStack>
            <YStack>
              <TodoCard label="Contribute to OSS" checked={false} />
              <TodoCard label="Learn about Tamagui's latest features" checked={true} />
              <TodoCard label="Upgrade to the new Expo version" checked={false} />
              <TodoCard label="Do the dishes" checked={false} />
            </YStack>
          </YStack>
        </ScrollView>
      )}
      {/* eslint-enable react-hooks/rules-of-hooks */}
    </XStack>
  )
}

const AchievementsSection = () => {
  return (
    <YStack gap="$4">
      <XStack px="$4.5" ai="center" gap="$2" jc="space-between" mb="$4">
        <H4 fontWeight="400">Getting Started</H4>
        <Theme name="alt2">
          <Button size="$2" chromeless {...useLink({ href: '/' })} iconAfter={ArrowRight}>
            All Achievements
          </Button>
        </Theme>
      </XStack>

      <ScrollAdapt>
        <XStack px="$4" flexWrap="wrap" flex={1} gap="$3">
          <Theme name="green">
            <AchievementCard
              width={300}
              $gtMd={{
                width: 'calc(50% - 12px)',
              }}
              $gtLg={{
                width: 'calc(25% - 12px)',
              }}
              icon={DollarSign}
              title="Make your first 100K"
              progress={{ current: 81_500, full: 100_000, label: 'dollars made' }}
              action={{
                text: 'Boost your sales',
                props: useLink({ href: '#' }),
              }}
            />
          </Theme>
          <Theme name="blue">
            <AchievementCard
              width={300}
              $gtMd={{
                width: 'calc(50% - 12px)',
              }}
              $gtLg={{
                width: 'calc(25% - 12px)',
              }}
              icon={User}
              title="Build your community"
              progress={{ current: 280, full: 500, label: 'members' }}
              action={{
                text: 'Boost your community',
                props: useLink({ href: '#' }),
              }}
            />
          </Theme>
          <Theme name="orange">
            <AchievementCard
              width={300}
              $gtMd={{
                width: 'calc(50% - 12px)',
              }}
              $gtLg={{
                width: 'calc(25% - 12px)',
              }}
              icon={Edit2}
              title="Set up your profile"
              progress={{ current: 2, full: 3, label: 'steps completed' }}
              action={{
                text: 'Continue profile setup',
                props: useLink({ href: '#' }),
              }}
            />
          </Theme>
          <Theme name="pink">
            <AchievementCard
              width={300}
              $gtMd={{
                width: 'calc(50% - 12px)',
              }}
              $gtLg={{
                width: 'calc(25% - 12px)',
              }}
              icon={Users}
              title="Refer 5 friends"
              progress={{ current: 4, full: 5, label: 'friends referred' }}
              action={{
                text: 'Refer friends',
                props: useLink({ href: '#' }),
              }}
            />
          </Theme>
        </XStack>
      </ScrollAdapt>
    </YStack>
  )
}

const OverviewSection = () => {
  return (
    <YStack gap="$4">
      <XStack px="$4.5" ai="center" gap="$2" jc="space-between" mb="$4">
        <H4 fontWeight="400">Overview</H4>
        <Theme name="alt2">
          <Button size="$2" chromeless {...useLink({ href: '/' })} iconAfter={ArrowRight}>
            View All Stats
          </Button>
        </Theme>
      </XStack>

      <ScrollAdapt>
        <XStack flexWrap="wrap" ai="flex-start" jc="flex-start" px="$4" gap="$8" mb="$4">
          <OverviewCard
            $gtMd={{ minWidth: 200, flex: 1, flexBasis: 0 }}
            $md={{ width: 150 }}
            title="MRR"
            value="$18,908"
            badgeText="+0.5%"
            badgeState="success"
          />

          <OverviewCard
            $gtMd={{ minWidth: 200, flex: 1, flexBasis: 0 }}
            $md={{ width: 150 }}
            title="ARR"
            value="$204,010"
            badgeText="+40.5%"
            badgeState="success"
          />

          <OverviewCard
            $gtMd={{ minWidth: 200, flex: 1, flexBasis: 0 }}
            $md={{ width: 150 }}
            title="Today's new users"
            value="4 Users"
            badgeText="+25%"
            badgeState="success"
          />

          <OverviewCard
            $gtMd={{ minWidth: 200, flex: 1, flexBasis: 0 }}
            $md={{ width: 150 }}
            title="Weekly Post Views"
            value="30,104"
            badgeText="-2%"
            badgeState="failure"
          />

          {/* <OverviewCard
            $gtMd={{ minWidth: 200, flex: 1, flexBasis: 0 }}
            $md={{ width: 150 }}
            title="This week's new users"
            value="14 Users"
            badgeText="-2%"
            badgeState="failure"
          />

          <OverviewCard
            $gtMd={{ minWidth: 200, flex: 1, flexBasis: 0 }}
            $md={{ width: 150 }}
            title="Monthly Post Views"
            value="150,104"
            badgeText="+1%"
            badgeState="success"
          /> */}
        </XStack>
      </ScrollAdapt>
    </YStack>
  )
}

const PostsSection = () => {
  return (
    <YStack gap="$4">
      <XStack px="$4.5" ai="center" gap="$2" jc="space-between" mb="$4">
        <H4 fontWeight="400">Latest Posts</H4>
        <Theme name="alt2">
          <Button size="$2" chromeless {...useLink({ href: '/' })} iconAfter={ArrowRight}>
            View All Posts
          </Button>
        </Theme>
      </XStack>
      <ScrollAdapt>
        <XStack px="$4" gap="$4" mb="$4" jc="flex-start" flexWrap="wrap">
          <FeedCard
            withImages
            width={300}
            $gtMd={{ width: 'calc(33.33% - 12px)' }}
            title="Why lorem ipsum look bad"
            description="Maybe it's just me - I'll just write out some dummy text just ignore the text tyvm..."
            tag="Design"
            authors={defaultAuthors}
          />

          <FeedCard
            withImages
            width={300}
            $gtMd={{ width: 'calc(33.33% - 12px)' }}
            title="Why you should use Tamagui"
            description="Tamagui is the best way to develop performant cross-platform apps with one codebase..."
            tag="React"
            authors={defaultAuthors}
          />

          <FeedCard
            withImages
            width={300}
            $gtMd={{ width: 'calc(33.33% - 12px)' }}
            title="Merits of functional programming"
            description="What is FP anyways? let's talk about it and learn about it's pros and cons..."
            tag="Programming"
            authors={defaultAuthors}
          />

          <FeedCard
            withImages
            width={300}
            $gtMd={{ width: 'calc(33.33% - 12px)' }}
            title="Different React paradigms"
            description="We're gonna talk about different react paradigm and jargons..."
            tag="React"
            authors={defaultAuthors}
          />

          <FeedCard
            withImages
            width={300}
            $gtMd={{ width: 'calc(33.33% - 12px)' }}
            title="Another Post"
            description="Hey this is yet another post I'm putting here for demo purposes..."
            tag="React"
            authors={defaultAuthors}
          />
          <FeedCard
            withImages
            width={300}
            $gtMd={{ width: 'calc(33.33% - 12px)' }}
            title="And Another Post"
            description="I'm out of ideas for dummy posts, Sint labore sit magna ea proident aute..."
            tag="React"
            authors={defaultAuthors}
          />
        </XStack>
      </ScrollAdapt>
    </YStack>
  )
}

function ScrollAdapt({ children }: { children: React.ReactNode }) {
  const { md } = useMedia()
  return md ? (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <>{children}</>
  )
}

const Greetings = () => {
  const greetingQuery = api.greeting.greet.useQuery()
  return (
    <YStack gap="$2">
      <H2 px="$4" my="$2">
        {greetingQuery.data}
      </H2>
    </YStack>
  )
}
