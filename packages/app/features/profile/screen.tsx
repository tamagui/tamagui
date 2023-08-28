import {
  Avatar,
  Button,
  H1,
  Paragraph,
  ScrollView,
  Settings,
  XStack,
  YStack,
  getTokens,
} from '@my/ui'
import { Box, Cog, Milestone, ShoppingCart, Users } from '@tamagui/lucide-icons'
import { useSafeAreaInsets } from 'app/utils/useSafeAreaInsets'
import { useUser } from 'app/utils/useUser'
import React from 'react'
import { SolitoImage } from 'solito/image'
import { Link, useLink } from 'solito/link'

export function ProfileScreen() {
  const { profile, avatarUrl } = useUser()
  const name = profile?.name
  const about = profile?.about

  const insets = useSafeAreaInsets()
  return (
    <ScrollView>
      <YStack
        maxWidth={600}
        mx="auto"
        width="100%"
        f={1}
        gap="$4"
        pb={insets.bottom + 20}
        pt={insets.top + 10}
      >
        <YStack gap="$8">
          <XStack gap="$2" jc="center" $sm={{ mt: '$8' }}>
            <Avatar circular size="$14">
              <SolitoImage
                src={avatarUrl}
                alt="your avatar"
                width={getTokens().size['14'].val}
                height={getTokens().size['14'].val}
              />
            </Avatar>
          </XStack>
          <YStack gap="$2">
            {name ? (
              <H1 ta="center">{name}</H1>
            ) : (
              <Link href="/profile/edit?edit_name=1">
                <H1 ta="center" textDecorationLine="underline">
                  No Name
                </H1>
              </Link>
            )}

            {!!about && (
              <Paragraph theme="alt1" ta="center" size="$6">
                {about}
              </Paragraph>
            )}
          </YStack>
        </YStack>
        <Button mx="$4" {...useLink({ href: '/profile/edit' })} themeInverse>
          Edit Profile
        </Button>

        <Settings>
          <Settings.Items>
            <Settings.Group>
              {/* dummy item - doesn't lead anywhere */}
              <Settings.Item icon={Box} accentColor="$green9">
                My Items
              </Settings.Item>
              {/* dummy item - doesn't lead anywhere */}
              <Settings.Item icon={Users} accentColor="$orange9">
                Refer Your Friends
              </Settings.Item>
              {/* dummy item - doesn't lead anywhere */}
              <Settings.Item icon={Milestone} accentColor="$blue9">
                Address Info
              </Settings.Item>
              {/* dummy item - doesn't lead anywhere */}
              <Settings.Item icon={ShoppingCart} accentColor="$blue9">
                Purchase History
              </Settings.Item>
              <Settings.Item {...useLink({ href: '/settings' })} icon={Cog} accentColor="$gray9">
                Settings
              </Settings.Item>
            </Settings.Group>
          </Settings.Items>
        </Settings>
      </YStack>
    </ScrollView>
  )
}
