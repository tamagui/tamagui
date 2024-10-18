export const notificationData = [
  {
    id: 1,
    postId: 1,
    action: `replied to`,
    user: {
      name: `SomeRandomDevWeb`,
      avatar: `https://placecats.com/millie/300/200`,
    },
  },
  {
    id: 2,
    postId: 2,
    action: `liked`,
    user: {
      name: `Floren Ryance`,
      avatar: `https://placecats.com/neo/300/200`,
    },
  },
  {
    id: 3,
    postId: 3,
    action: `liked`,
    user: {
      name: `PrimeRageN`,
      avatar: `https://placecats.com/millie_neo/300/200`,
    },
  },
  {
    id: 4,
    postId: 4,
    action: `replied to`,
    user: {
      name: `bramadov 22`,
      avatar: `https://placecats.com/neo_banana/300/200`,
    },
  },
]

export type NotificationItem = (typeof notificationData)[0]
