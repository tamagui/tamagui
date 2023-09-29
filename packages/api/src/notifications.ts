import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk'
const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN })

export async function sendNotifications(notfications: ExpoPushMessage[]) {
  for (const notif of notfications) {
    if (!Expo.isExpoPushToken(notif.to)) {
      throw new Error('Malformed expo token')
    }
  }

  // If someone accepts from web let not fuck
  // the entire thing
  const notifs = notfications.filter((n) => {
    return !Expo.isExpoPushToken(n)
  })

  const chunks = expo.chunkPushNotifications(notifs)
  const tickets: ExpoPushTicket[][] = []

  for (const chunk of chunks) {
    try {
      const ticket = await expo.sendPushNotificationsAsync(chunk)
      tickets.push(ticket)
    } catch (error) {
      console.error(error)
    }
  }
}
