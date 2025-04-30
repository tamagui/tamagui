import { useEffect, useMemo, useState } from 'react'
import {
  type TeamMember,
  useInviteTeamMember,
  useRemoveTeamMember,
  useTeamSeats,
} from './useTeamSeats'
import {
  Button,
  H4,
  Paragraph,
  H3,
  YStack,
  XStack,
  Form,
  Fieldset,
  Label,
  Input,
  Spinner,
  Separator,
  Avatar,
} from 'tamagui'
import { paymentModal } from './StripePaymentModal'

import { debounce } from 'lodash'
import { getDefaultAvatarImage } from '~/features/user/getDefaultAvatarImage'

export const TeamTab = () => {
  const { data: teamData, error, isLoading } = useTeamSeats()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<GitHubUser[]>([])

  const searchUsers = useMemo(
    () =>
      debounce(async (query: string) => {
        if (!query) {
          setSearchResults([])
          return
        }
        setIsSearching(true)
        try {
          const response = await fetch(`/api/github/users?q=${query}`)
          const data = await response.json()
          if (response.ok) {
            setSearchResults(data.users)
          } else {
            console.error('Search failed:', data.error)
          }
        } catch (error) {
          console.error('Search error:', error)
        } finally {
          setIsSearching(false)
        }
      }, 300),
    []
  )

  useEffect(() => {
    searchUsers(searchQuery)
  }, [searchQuery, searchUsers])

  if (isLoading) {
    return (
      <YStack f={1} ai="center" jc="center">
        <Spinner size="large" />
      </YStack>
    )
  }

  if (error || !teamData) {
    return (
      <YStack gap="$4">
        <H3>No Team Subscription</H3>
        <Paragraph theme="alt1">
          Purchase team seats to invite team members to your Tamagui Pro subscription.
        </Paragraph>
        <Button
          theme="accent"
          onPress={() => {
            paymentModal.show = true
            paymentModal.teamSeats = 1
          }}
        >
          Purchase Team Seats
        </Button>
      </YStack>
    )
  }

  return (
    <YStack gap="$6">
      <YStack gap="$4">
        <H3>Team Management</H3>
        <XStack ai="center" jc="space-between">
          <Paragraph theme="alt1">
            {teamData.subscription.used_seats || 0} of {teamData.subscription.total_seats}{' '}
            seats used
          </Paragraph>
        </XStack>
      </YStack>

      {teamData.subscription.used_seats < teamData.subscription.total_seats && (
        <YStack gap="$4">
          <H4>Invite Team Member</H4>
          <Form gap="$2">
            <XStack gap="$2" ai="flex-end">
              <Fieldset f={1}>
                <Label htmlFor="github-username">GitHub Username</Label>
                <Input
                  id="github-username"
                  placeholder="Search GitHub users by username, email, or id"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </Fieldset>
            </XStack>
          </Form>

          <YStack gap="$2">
            {isSearching ? (
              <XStack p="$2" ai="center" jc="center">
                <Spinner size="small" />
              </XStack>
            ) : (
              searchResults.map((githubUser) => (
                <GitHubUserRow
                  key={githubUser.id}
                  user={githubUser}
                  subscriptionId={teamData.subscription.id}
                />
              ))
            )}
          </YStack>
        </YStack>
      )}

      <Separator />

      <YStack gap="$4">
        <H4>Team Members</H4>
        <YStack gap="$2">
          {teamData.members.map((member) => (
            <TeamMemberRow
              key={member.id}
              member={member}
              subscriptionId={teamData.subscription.id}
            />
          ))}
        </YStack>
      </YStack>
    </YStack>
  )
}

type GitHubUser = {
  id: string
  full_name: string | null
  avatar_url: string | null
  email: string | null
}

const GitHubUserRow = ({
  user,
  subscriptionId,
}: {
  user: GitHubUser
  subscriptionId: string
}) => {
  const {
    trigger: inviteTeamMember,
    isMutating: isInviting,
    error: inviteError,
  } = useInviteTeamMember(subscriptionId)

  return (
    <XStack
      borderWidth={1}
      borderColor="$color3"
      borderRadius="$4"
      p="$3"
      ai="center"
      jc="space-between"
    >
      <XStack ai="center" gap="$3">
        <Avatar circular size="$3">
          <Avatar.Image source={{ uri: user.avatar_url ?? '' }} />
        </Avatar>
        <YStack>
          <Paragraph>{user.full_name ?? 'Unknown User'}</Paragraph>
          <Paragraph size="$2" theme="alt2">
            {user.email ?? 'Unknown Email'}
          </Paragraph>
          {inviteError && (
            <Paragraph size="$2" color="$red10">
              Error: {inviteError.message}
            </Paragraph>
          )}
        </YStack>
      </XStack>

      <Button
        theme="accent"
        size="$2"
        onPress={() => inviteTeamMember({ user_id: String(user.id) })}
        disabled={isInviting}
      >
        {isInviting ? 'Inviting...' : 'Invite'}
      </Button>
    </XStack>
  )
}

const TeamMemberRow = ({
  member,
  subscriptionId,
}: {
  member: TeamMember
  subscriptionId: string
}) => {
  const { trigger: removeTeamMember, isMutating: isRemoving } =
    useRemoveTeamMember(subscriptionId)

  return (
    <XStack
      borderWidth={1}
      borderColor="$color3"
      borderRadius="$4"
      p="$3"
      ai="center"
      jc="space-between"
    >
      <XStack ai="center" gap="$3">
        <Avatar circular size="$3">
          <Avatar.Image
            source={{
              uri:
                member.user?.avatar_url ??
                getDefaultAvatarImage(member.user?.full_name ?? ''),
            }}
          />
        </Avatar>
        <YStack>
          <Paragraph>{member.user?.full_name ?? 'Unknown User'}</Paragraph>
          <Paragraph theme="alt2" size="$2">
            {member.user?.email}
          </Paragraph>
        </YStack>
      </XStack>

      <XStack ai="center" gap="$2">
        <Paragraph size="$2" theme="alt2">
          {member.role}
        </Paragraph>
        <Button
          theme="red"
          size="$2"
          onPress={() => removeTeamMember({ team_member_id: member.user?.id ?? '' })}
          disabled={isRemoving}
        >
          {isRemoving ? 'Removing...' : 'Remove'}
        </Button>
      </XStack>
    </XStack>
  )
}
