import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'

export type TeamMember = {
  id: string
  member_id: string
  role: string
  status: string
  joined_at: string
  user: {
    id: string
    email: string
    full_name: string
    avatar_url: string
  } | null
}

export type TeamSubscription = {
  subscription: {
    id: string
    total_seats: number
    used_seats: number
    created_at: string
    expires_at: string
    status: string
    stripe_subscription_id: string
  }
  members: TeamMember[]
}

export const useTeamSeats = () => {
  return useSWR<TeamSubscription>('/api/team-seat', (url) =>
    fetch(url).then((res) => {
      if (!res.ok) throw new Error('Failed to fetch team seats')
      return res.json()
    })
  )
}

export const useInviteTeamMember = (team_subscription_id: string) => {
  return useSWRMutation('/api/team-seat', (url, { arg }: { arg: { user_id: string } }) =>
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({ user_id: arg.user_id, team_subscription_id }),
    }).then((res) => {
      if (!res.ok) throw new Error('Failed to invite team member')
      return res.json()
    })
  )
}

export const useRemoveTeamMember = (team_subscription_id: string) => {
  return useSWRMutation(
    '/api/team-seat',
    (url, { arg }: { arg: { team_member_id: string } }) =>
      fetch(url, {
        method: 'DELETE',
        body: JSON.stringify({
          team_member_id: arg.team_member_id,
          team_subscription_id,
        }),
      }).then((res) => {
        if (!res.ok) throw new Error('Failed to remove team member')
        return res.json()
      })
  )
}
