import { TRPCError } from '@trpc/server'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { z } from 'zod'

import {
  add,
} from 'date-fns'
import { ExpoPushMessage } from 'expo-server-sdk'
import { sendNotifications } from '../notifications'
// for (let pushToken of somePushTokens) {
//   // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

//   // Check that all your push tokens appear to be valid Expo push tokens
//   if (!Expo.isExpoPushToken(pushToken)) {
//     console.error(`Push token ${pushToken} is not a valid Expo push token`);
//     continue;
//   }

//   // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
//   messages.push({
//     to: pushToken,
//     sound: 'default',
//     body: 'This is a test notification',
//     data: { withSome: 'data' },
//   })
// }

// // The Expo push notification service accepts batches of notifications so
// // that you don't need to send 1000 requests to send 1000 notifications. We
// // recommend you batch your notifications to reduce the number of requests
// // and to compress them (notifications with similar content will get
// // compressed).
// let chunks = expo.chunkPushNotifications(messages);
// let tickets = [];
// (async () => {
//   // Send the chunks to the Expo push notification service. There are
//   // different strategies you could use. A simple one is to send one chunk at a
//   // time, which nicely spreads the load out over time:
//   for (let chunk of chunks) {
//     try {
//       let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
//       console.log(ticketChunk);
//       tickets.push(...ticketChunk);
//       // NOTE: If a ticket contains an error code in ticket.details.error, you
//       // must handle it appropriately. The error codes are listed in the Expo
//       // documentation:
//       // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
//     } catch (error) {
//       console.error(error);
//     }
//   }
// })();


// // Later, after the Expo push notification service has delivered the
// // notifications to Apple or Google (usually quickly, but allow the the service
// // up to 30 minutes when under load), a "receipt" for each notification is
// // created. The receipts will be available for at least a day; stale receipts
// // are deleted.
// //
// // The ID of each receipt is sent back in the response "ticket" for each
// // notification. In summary, sending a notification produces a ticket, which
// // contains a receipt ID you later use to get the receipt.
// //
// // The receipts may contain error codes to which you must respond. In
// // particular, Apple or Google may block apps that continue to send
// // notifications to devices that have blocked notifications or have uninstalled
// // your app. Expo does not control this policy and sends back the feedback from
// // Apple and Google so you can handle it appropriately.
// let receiptIds = [];
// for (let ticket of tickets) {
//   // NOTE: Not all tickets have IDs; for example, tickets for notifications
//   // that could not be enqueued will have error information and no receipt ID.
//   if (ticket.id) {
//     receiptIds.push(ticket.id);
//   }
// }

// let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
// (async () => {
//   // Like sending notifications, there are different strategies you could use
//   // to retrieve batches of receipts from the Expo service.
//   for (let chunk of receiptIdChunks) {
//     try {
//       let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
//       console.log(receipts);

//       // The receipts specify whether Apple or Google successfully received the
//       // notification and information about an error, if one occurred.
//       for (let receiptId in receipts) {
//         let { status, message, details } = receipts[receiptId];
//         if (status === 'ok') {
//           continue;
//         } else if (status === 'error') {
//           console.error(
//             `There was an error sending a notification: ${message}`
//           );
//           if (details && details.error) {
//             // The error codes are listed in the Expo documentation:
//             // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
//             // You must handle the errors appropriately.
//             console.error(`The error code is ${details.error}`);
//           }
//         }
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   }
// })();

export const climbRouter = createTRPCRouter({
  read: protectedProcedure.query(async ({ ctx: { supabase } }) => {
    // const climbs = await supabase.from('climbs').select(`*, climber:profiles(*)`).filter('requested', 'lte', 'joined').order('created_at', { ascending: false })
    const climbs = await supabase
      .from('climbs')
      .select(`*, climber:profiles(*)`)
      .lt('joined', 2)
      .gt('start', new Date().toISOString())
      // Need to get climbs that start after now.
      .order('start', { ascending: true })

    if (climbs.error) {
      console.log(climbs.error)
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }

    return climbs.data.map((climb) => {
      return {
        ...climb,
        climber: Array.isArray(climb.climber) ? climb.climber[0] : climb.climber
      };
    })
  }),
  join: protectedProcedure.input(z.object({
    climb_id: z.number(),
  })).mutation(async ({ ctx: { supabase, session }, input }) => {

    const climb = await supabase.from('climbs').select(`*`).eq('id', input.climb_id).single()
    if (climb.error) {
      console.log(climb.error)
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }

    if (climb.data.joined >= climb?.data?.requested) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Climb is full' })
    }

    const updatedClimb = await supabase.from('climbs').update({
      joined: climb.data.joined + 1,
    }).eq('id', input.climb_id)

    if (updatedClimb.error) {
      console.log(updatedClimb.error)
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }

    const profileClimb = await supabase.from("profile_climbs").insert({
      profile_id: session?.user.id,
      climb_id: input.climb_id,
    })

    if (profileClimb.error) {
      console.log(profileClimb.error)
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }

    const { data: climber = [] } = await supabase.from('profiles').select(`*`).eq('id', climb.data.created_by)
    const { data: belayer = [] } = await supabase.from('profiles').select(`*`).eq('id', session.user?.id)
    console.log(climber?.[0]?.expo_token, belayer?.[0]?.expo_token, 'aaaaaaaa')
    const c = climber?.[0]
    const b = belayer?.[0]
    console.log(c)
    if (!c || !b) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Missing expo token' })
    }

    const messages: ExpoPushMessage[] = [{
      to: c.expo_token ?? '',
      sound: 'default',
      body: `${b.first_name} has joined your climb`,
      data: { withSome: 'data' },
    }, {
      to: b.expo_token ?? '',
      sound: 'default',
      body: `you are scheduled to climb with ${c.first_name}`,
      data: { withSome: 'data' },
    }]

    sendNotifications(messages)
    return true

  }),
  create: protectedProcedure.input(z.object({
    name: z.string(),
    type: z.string(),
    start: z.string(),
    duration: z.string(),
    location: z.string(),
    day: z.string(),
  })).mutation(async ({ ctx: { supabase, session }, input }) => {

    const profile = await supabase.from('climbs').insert([{
      name: input.name,
      type: input.type as any,
      start: add(new Date(input.start), {
        days: Number(input.day)
      }).toISOString(),
      duration: add(new Date(input.start), {
        minutes: Number(input.duration)
      }).toISOString(),
      // location: input.location,
      created_by: session?.user.id,
      created_at: new Date().toISOString(),
    }]).select()

    if (profile.error) {
      console.log(profile.error)
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }

    console.log(profile)
    return true
  }),
})
