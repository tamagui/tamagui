
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { z } from 'zod'

import { Expo, ExpoPushMessage } from 'expo-server-sdk';

const expo = new Expo({ accessToken: 'HQgepaSF27aFDYdM9iPl8sHiKva5tsbu0_FYZK5o' });
export const meRouter = createTRPCRouter({
  profile: createTRPCRouter({
    read: protectedProcedure.query(async ({ ctx: { supabase, session } }) => {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
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
    update: protectedProcedure.input(z.object({
      first_name: z.string().optional(),
      bio: z.string().optional(),
      expo_token: z.string().optional()
    })).mutation(async ({ ctx: { supabase, session }, input }) => {

      const { data, error } = await supabase
        .from('profiles')
        .update({ ...input })
        .eq('id', session.user.id).single()

      if (error) {
        throw new TRPCError({ code: error?.code as any, message: error.message })
      }

      return data
    }),
  }),

  // updateExpoToken: protectedProcedure.input(z.object({
  //   token: z.string().optional(),
  // })).mutation(async () => {
  //   return 'hello'
  // }),
  testNotifFromServer: protectedProcedure.input(z.object({
    title: z.string(),
    body: z.string()
  })).mutation(async () => {
    console.log(process.env.BENJAMIN_PHONE_EXPO_TOKEN, 'ExponentPushToken[hQyzQGD62nI5e3PipCBGl7]')
    const messages = [
      {
        to: 'ExponentPushToken[hQyzQGD62nI5e3PipCBGl7]',
        sound: 'default',
        body: `from the server bitch has joined your climb`,
        data: { withSome: 'data' },
      }
    ]


    // to: ExpoPushToken | ExpoPushToken[];
    // data?: object;
    // title?: string;
    // subtitle?: string;
    // body?: string;
    // sound?: 'default' | null | {
    //     critical?: boolean;
    //     name?: 'default' | null;
    //     volume?: number;
    // };
    // ttl?: number;
    // expiration?: number;
    // priority?: 'default' | 'normal' | 'high';
    // badge?: number;
    // channelId?: string;
    // categoryId?: string;
    // mutableContent?: boolean;
    const chunks = expo.chunkPushNotifications([
      {
        to: 'ExponentPushToken[aZBtiuP6QZ29Gzoc7B_yVC]',
        title: 'BIG Test',
        body: 'small test'
      }
    ]);


    for (const chunk of chunks) {

      try {
        const ticket = await expo.sendPushNotificationsAsync(chunk)
        console.log(ticket)
      }

      catch (error) {
        console.log(JSON.stringify(error));

        // The important part:
        // error.details = { EXPO_PROJECT_NAME: [ ExponentPushTokens ] }
      }
    }

    // for (const chunk in chunks) {
    //   const ticket = await expo.sendPushNotificationsAsync(chunk)
    // }
  }),
  climbs: protectedProcedure.query(async ({ ctx: { supabase, session } }) => {

    const { data: profileClimbData, error } = await supabase.from('profile_climbs').select(`*, climb:climbs(*)`).eq('profile_id', session.user.id)
    const { data: profiles } = await supabase.from('profiles').select('*')


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
      // This should probably be done in the query
    }).filter(c => {
      return c.climb?.start > new Date().toISOString()
    }).sort((a, b) => {
      if (a.climb?.start < b.climb?.start) {
        return -1
      } else if (a.climb?.start > b.climb?.start) {
        return 1
      }
      return 0
    })
  }),
})
