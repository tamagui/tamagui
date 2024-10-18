import { desc, eq, sql } from 'drizzle-orm'
import { type Href, type LoaderProps, SafeAreaView, getURL, useLoader } from 'one'
import { ScrollView } from 'react-native'
import { isWeb } from 'tamagui'
import { db } from '~/code/db/connection'
import { follows, likes, posts, reposts, users } from '~/code/db/schema'
import { NotificationCard } from '~/code/notifications/NotificationCard'
import { PageContainer } from '~/code/ui/PageContainer'

type NotificationType = 'like' | 'follow' | 'repost'

export async function loader({ path }: LoaderProps) {
  try {
    const url = new URL(getURL() + path)
    const page = Number(url.searchParams.get('page') || '1')
    const limit = Number(url.searchParams.get('limit') || '50')
    const offset = (page - 1) * limit

    // Fetch a random user from the database
    const randomUserQuery = db
      .select({
        id: users.id,
        name: users.username,
        avatar: users.avatarUrl,
      })
      .from(users)
      .orderBy(sql`RANDOM()`)
      .limit(1)

    const randomUser = await randomUserQuery

    if (randomUser.length === 0) {
      throw new Error('No users found in the database')
    }

    const USER_ID = randomUser[0].id

    const notificationsQuery = db
      .select({
        username: users.username,
        avatar: users.avatarUrl,
        userId: users.id,
        postId: posts.id,
        postContent: posts.content,
        createdAt: sql`${likes.createdAt} as created_at`,
        actionType: sql`'like'`.as('actionType'),
      })
      .from(likes)
      .leftJoin(users, eq(users.id, likes.userId))
      .leftJoin(posts, eq(posts.id, likes.postId))
      .where(eq(posts.userId, USER_ID))
      .union(
        db
          .select({
            username: users.username,
            avatar: users.avatarUrl,
            userId: users.id,
            postId: posts.id,
            postContent: posts.content,
            createdAt: sql<Date>`${reposts.createdAt} as created_at`,
            actionType: sql<NotificationType>`'repost'`.as('actionType'),
          })
          .from(reposts)
          .leftJoin(users, eq(users.id, reposts.userId))
          .leftJoin(posts, eq(posts.id, reposts.postId))
          .where(eq(posts.userId, USER_ID))
      )
      .union(
        // @ts-expect-error TODO
        db
          .select({
            username: users.username,
            avatar: users.avatarUrl,
            userId: users.id,
            postId: sql`NULL`.as('postId'),
            postContent: sql`NULL`.as('postContent'),
            createdAt: sql<Date>`${follows.createdAt} as created_at`,
            actionType: sql<NotificationType>`'follow'`.as('actionType'),
          })
          .from(follows)
          .leftJoin(users, eq(users.id, follows.followerId))
          .where(eq(follows.followingId, USER_ID))
      )
      .orderBy(desc(sql`created_at`))
      .limit(limit)
      .offset(offset)

    const notifications = await notificationsQuery

    const formattedNotifications = notifications.map((notification) => ({
      action: notification.actionType as NotificationType,
      fromUser: {
        username: notification.username,
        // TODO: Href helper function
        userLink: `/profile/${notification.userId}` as Href,
        avatar: notification.avatar,
      },
      post: notification.postId
        ? {
            postLink: `/post/${notification.postId}` as Href,
            content: notification.postContent,
          }
        : null,
      createdAt: notification.createdAt as Date,
    }))

    return {
      notifications: formattedNotifications,
      total: notifications.length,
      page,
      limit,
    }
  } catch (error) {
    console.error(error)
    throw new Error(`Failed to fetch notifications: ${(error as Error).message}`)
  }
}

export default function NotificationsPage() {
  const { notifications } = useLoader(loader)
  const feed = notifications.map((item, i) => {
    return <NotificationCard key={i} {...item} />
  })

  return (
    <ScrollView>
      <PageContainer>{isWeb ? feed : <SafeAreaView>{feed}</SafeAreaView>}</PageContainer>
    </ScrollView>
  )
}
