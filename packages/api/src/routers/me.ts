import { TRPCError } from '@trpc/server'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { z } from 'zod'

import { Expo } from 'expo-server-sdk'

const expo = new Expo({
  // TODO: put in a env file
  accessToken: 'HQgepaSF27aFDYdM9iPl8sHiKva5tsbu0_FYZK5o',
})
export const meRouter = createTRPCRouter({
  profile: createTRPCRouter({
    read: protectedProcedure.query(async ({ ctx: { supabase, session } }) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      if (error) {
        // no rows - edge case of user being deleted
        if (error.code === 'PGRST116') {
          await supabase.auth.signOut()
          return null
        }
        throw new Error(error.message)
      }
      return data
    }),
    update: protectedProcedure
      .input(
        z.object({
          first_name: z.string().optional(),
          bio: z.string().optional(),
          expo_token: z.string().optional(),
        })
      )
      .mutation(async ({ ctx: { supabase, session }, input }) => {
        const { data, error } = await supabase
          .from('profiles')
          .update({ ...input })
          .eq('id', session.user.id)
          .single()

        if (error) {
          throw new TRPCError({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            code: error?.code as any,
            message: error.message,
          })
        }

        return data
      }),
  }),

  testNotifFromServer: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        body: z.string(),
      })
    )
    .mutation(async () => {
      const chunks = expo.chunkPushNotifications([
        {
          to: 'ExponentPushToken[aZBtiuP6QZ29Gzoc7B_yVC]',
          title: 'BIG Test',
          body: 'small test',
        },
      ])

      for (const chunk of chunks) {
        try {
          // TODO: Need to do something with this ticket
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const ticket = await expo.sendPushNotificationsAsync(chunk)
        } catch (error) {
          console.error(JSON.stringify(error))
        }
      }
    }),
  climbs: protectedProcedure.query(async ({ ctx: { supabase, session } }) => {
    const { data: profileClimbData, error } = await supabase
      .from('profile_climbs')
      .select(`*, climb:climbs(*)`)
      .eq('profile_id', session.user.id)
    const { data: profiles } = await supabase.from('profiles').select('*')

    if (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new TRPCError({ code: error?.code as any, message: error.message })
    }
    return profileClimbData
      ?.map((profileClimb) => {
        return {
          ...profileClimb,
          climb: Array.isArray(profileClimb.climb)
            ? profileClimb.climb[0]
            : profileClimb.climb,
        }
      })
      .map((profileClimb) => {
        const climb = profileClimb.climb
        const profile = profiles?.find(
          (profile) => profile.id === climb?.created_by
        )
        return {
          ...profileClimb,
          climb,
          profile,
        }
        // This should probably be done in the query
      })
      .filter((c) => {
        return c.climb?.start > new Date().toISOString()
      })
      .sort((a, b) => {
        if (a.climb?.start < b.climb?.start) {
          return -1
        } else if (a.climb?.start > b.climb?.start) {
          return 1
        }
        return 0
      })
  }),
})
