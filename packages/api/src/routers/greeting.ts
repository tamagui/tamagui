import { TRPCError } from '@trpc/server'
import { createTRPCRouter, protectedProcedure } from '../trpc'

function getTimeOfDay() {
  const today = new Date()
  const curHr = today.getHours()

  if (curHr < 4) {
    return 'night'
  } else if (curHr < 12) {
    return 'morning'
  } else if (curHr < 18) {
    return 'afternoon'
  } else {
    return 'night'
  }
}

export const greetingRouter = createTRPCRouter({
  greet: protectedProcedure.query(async ({ ctx: { supabase, session } }) => {
    const profile = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
    if (profile.error) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
    const name = profile.data.first_name
    return `Good ${getTimeOfDay()}${name ? `, ${name}!` : '!'}`
  }),
})
