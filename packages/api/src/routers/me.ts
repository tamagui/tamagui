
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, protectedProcedure } from '../trpc'


export const meRouter = createTRPCRouter({
  climbs: protectedProcedure.query(async ({ ctx: { supabase, session } }) => {
    // const climbs = await supabase.from('profile_climbs').select('*').eq('created_by', session.user.id)
    // if (climbs.error) {
    //   throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    // }
    // return climbs.data
    const { data: profileClimbData, error } = await supabase.from('profile_climbs').select(`*, climb:climbs(*)`).eq('profile_id', session.user.id)
    const { data: profiles, error: profileError } = await supabase.from('profiles').select('*')


    if (error) {
      throw new TRPCError({ code: error?.code as any, message: error.message })


    }
    return profileClimbData?.map((profileClimb) => {
      return {
        ...profileClimb,
        climb: Array.isArray(profileClimb.climb) ? profileClimb.climb[0] : profileClimb.climb
      };
    }).map((profileClimb) => {
      const climb = profileClimb.climb
      const profile = profiles?.find(profile => profile.id === climb?.created_by)
      return {
        ...profileClimb,
        climb,
        profile,
      }
    })
  }),
})
