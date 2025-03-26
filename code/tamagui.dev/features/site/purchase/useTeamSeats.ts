import useSWR from 'swr'

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
