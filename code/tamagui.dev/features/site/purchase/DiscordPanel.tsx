import { Avatar, Button, H4, Paragraph, Tabs, XStack, YStack } from 'tamagui'

import type { APIGuildMember, RESTGetAPIGuildMembersSearchResult } from '@discordjs/core'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import useSWR, { mutate } from 'swr'
import useSWRMutation from 'swr/mutation'
import { Fieldset, Input, Label } from 'tamagui'
import { Form } from 'tamagui'
import { Link } from 'one'
import { Search } from '@tamagui/lucide-icons'
import { PRODUCT_NAME, type Subscription } from '~/features/auth/types'

type DiscordApiType = 'channel' | 'support'

export const DiscordPanel = ({
  subscription,
}: {
  subscription: Subscription
}) => {
  const searchRef = useRef<SearchFormRef>(null)

  const hasSupportTier = () => {
    const supportItem = subscription.subscription_items?.find((item) => {
      return item.price?.product?.name === PRODUCT_NAME.TAMAGUI_SUPPORT
    })

    if (!supportItem) {
      return false
    }

    // Calculate tier from unit_amount (80000 cents = $800 = Tier 1)
    const unitAmount = supportItem.price?.unit_amount
    if (!unitAmount) {
      return false
    }

    // If unit_amount is at least 80000 (Tier 1 or higher)
    return unitAmount >= 80000
  }

  const [activeApi, setActiveApi] = useState<DiscordApiType>('channel')

  const groupInfoSwr = useSWR<any>(
    `/api/discord/${activeApi}?${new URLSearchParams({ subscription_id: subscription.id })}`,
    (url) =>
      fetch(url, { headers: { 'Content-Type': 'application/json' } }).then((res) =>
        res.json()
      ),
    { revalidateOnFocus: false, revalidateOnReconnect: false, errorRetryCount: 0 }
  )

  // Get subscription details to determine available access types
  const { data: subscriptionData } = useSWR<any>(
    subscription.id ? `/api/products?subscription_id=${subscription.id}` : null,
    (url) => fetch(url).then((res) => res.json())
  )

  const resetChannelMutation = useSWRMutation(
    [`/api/discord/${activeApi}`, 'DELETE', subscription.id],
    (url) =>
      fetch(`/api/discord/${activeApi}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription_id: subscription.id,
        }),
      }).then((res) => res.json()),
    {
      onSuccess: async () => {
        await mutate(
          `/api/discord/${activeApi}?${new URLSearchParams({
            subscription_id: subscription.id,
          })}`
        )

        searchRef.current?.reset()
      },
    }
  )

  return (
    <YStack gap="$3">
      <XStack jc="space-between" gap="$2" ai="center">
        <H4>
          Discord Access{' '}
          {!!groupInfoSwr.data &&
            `(${groupInfoSwr.data?.currentlyOccupiedSeats}/${groupInfoSwr.data?.discordSeats})`}
        </H4>

        <Button
          size="$2"
          onPress={() => resetChannelMutation.trigger()}
          disabled={resetChannelMutation.isMutating}
        >
          {resetChannelMutation.isMutating ? 'Resetting...' : 'Reset'}
        </Button>
      </XStack>

      <Tabs
        value={activeApi}
        onValueChange={(val: string) => setActiveApi(val as 'channel' | 'support')}
        orientation="horizontal"
        flexDirection="column"
        size="$4"
      >
        <Tabs.List backgroundColor="$color2" mb="$4">
          <Tabs.Tab value="channel" f={1}>
            <Paragraph>General Channel</Paragraph>
          </Tabs.Tab>
          <Tabs.Tab value="support" f={1}>
            <Paragraph>Support Channel</Paragraph>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Content value="channel">
          <YStack gap="$4">
            <Paragraph theme="alt2">
              Join the #takeout-general channel to discuss Tamagui with other Pro users.
            </Paragraph>

            <SearchForm ref={searchRef} activeApi="channel" subscription={subscription} />
          </YStack>
        </Tabs.Content>

        <Tabs.Content value="support">
          <YStack gap="$4">
            {hasSupportTier() ? (
              <>
                <Paragraph theme="alt2">
                  Get access to your private support channel where you can directly
                  communicate with the Tamagui team.
                </Paragraph>
                <SearchForm
                  ref={searchRef}
                  activeApi="support"
                  subscription={subscription}
                />
              </>
            ) : (
              <YStack gap="$4" p="$4" backgroundColor="$color2" br="$4">
                <Paragraph theme="alt2" ta="center">
                  You need a Support tier subscription to access private support channels.
                </Paragraph>
              </YStack>
            )}
          </YStack>
        </Tabs.Content>
      </Tabs>
    </YStack>
  )
}

const DiscordMember = ({
  member,
  subscriptionId,
  apiType,
}: {
  member: APIGuildMember
  subscriptionId: string
  apiType: 'channel' | 'support'
}) => {
  const { data, error, isMutating, trigger } = useSWRMutation(
    [`/api/discord/${apiType}`, 'POST', member.user?.id],
    async () => {
      const res = await fetch(`/api/discord/${apiType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription_id: subscriptionId,
          discord_id: member.user?.id,
        }),
      })

      if (res.status < 200 || res.status > 299) {
        throw await res.json()
      }
      return await res.json()
    },
    {
      onSuccess: async () => {
        await mutate(
          `/api/discord/${apiType}?${new URLSearchParams({
            subscription_id: subscriptionId,
          })}`
        )
      },
    }
  )

  const name = member.nick || member.user?.global_name
  const username = `${member.user?.username}${
    member.user?.discriminator !== '0' ? `#${member.user?.discriminator}` : ''
  }`
  const avatarSrc = member.user?.avatar
    ? `https://cdn.discordapp.com/avatars/${member.user?.id}/${member.user?.avatar}.png`
    : null

  return (
    <XStack gap="$2" ai="center" flexWrap="wrap">
      <Button minWidth={70} size="$2" disabled={isMutating} onPress={() => trigger()}>
        {isMutating ? 'Inviting...' : 'Add'}
      </Button>
      <Avatar circular size="$2">
        <Avatar.Image accessibilityLabel={`avatar for ${username}`} src={avatarSrc!} />
        <Avatar.Fallback backgroundColor="$blue10" />
      </Avatar>
      <Paragraph>{`${username}${name ? ` (${name})` : ''}`}</Paragraph>
      {data && (
        <Paragraph size="$1" theme="green">
          {data.message}
        </Paragraph>
      )}
      {error && (
        <Paragraph size="$1" theme="red">
          {error.message}
        </Paragraph>
      )}
    </XStack>
  )
}

type SearchFormRef = {
  reset: () => void
}

const SearchForm = forwardRef<
  SearchFormRef,
  {
    activeApi: DiscordApiType
    subscription: Subscription
  }
>(({ activeApi, subscription }, ref) => {
  const [draftQuery, setDraftQuery] = useState('')
  const [query, setQuery] = useState(draftQuery)

  useImperativeHandle(ref, () => ({
    reset: () => {
      setDraftQuery('')
      setQuery('')
    },
  }))

  const handleSearch = async () => {
    setQuery(draftQuery)
  }

  const searchSwr = useSWR<RESTGetAPIGuildMembersSearchResult>(
    query
      ? `/api/discord/search-member?${new URLSearchParams({ query }).toString()}`
      : null,
    (url) =>
      fetch(url, { headers: { 'Content-Type': 'application/json' } }).then((res) =>
        res.json()
      )
  )

  return (
    <>
      <Form onSubmit={handleSearch} gap="$2" flexDirection="row" ai="flex-end">
        <Fieldset>
          <Label size="$3" theme="alt1" htmlFor="discord-username">
            Username / Nickname
          </Label>

          <Input
            miw={200}
            placeholder="Your username..."
            id="discord-username"
            value={draftQuery}
            onChangeText={setDraftQuery}
          />
        </Fieldset>

        <Form.Trigger>
          <Button icon={Search}>Search</Button>
        </Form.Trigger>
      </Form>

      <XStack tag="article">
        <Paragraph size="$3" theme="alt1">
          Note: You must{' '}
          <Link target="_blank" href="https://discord.gg/4qh6tdcVDa">
            join the Discord server
          </Link>{' '}
          first so we can find your username.
        </Paragraph>
      </XStack>

      <YStack gap="$2">
        {searchSwr.data?.map((member) => (
          <DiscordMember
            key={member.user?.id}
            member={member}
            subscriptionId={subscription.id}
            apiType={activeApi}
          />
        ))}
      </YStack>
    </>
  )
})
