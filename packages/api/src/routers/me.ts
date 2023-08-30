
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, protectedProcedure } from '../trpc'


export const meRouter = createTRPCRouter({
  climbs: protectedProcedure.query(async ({ ctx: { supabase, session } }) => {
    const climbs = await supabase.from('profile_climbs').select('*').eq('created_by', session.user.id)
    if (climbs.error) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
    return climbs.data
  }
  ),
})
