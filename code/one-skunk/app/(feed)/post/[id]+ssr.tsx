import { eq, sql } from 'drizzle-orm'
import { useLoader, useNavigation, useParams } from 'one'
import { useEffect } from 'react'
import { YStack } from 'tamagui'
import { db } from '~/code/db/connection'
import { likes, posts, replies, reposts, users } from '~/code/db/schema'
import { FeedCard } from '~/code/feed/FeedCard'
import { PageContainer } from '~/code/ui/PageContainer'

export async function loader({ params }) {
  const id = params.id

  if (!id) {
    throw new Error('Invalid post ID')
  }

  try {
    const post = await db
      .select({
        id: posts.id,
        content: posts.content,
        createdAt: posts.createdAt,
        user: {
          name: users.username,
          avatar: users.avatarUrl,
        },
        likesCount:
          sql<number>`(SELECT COUNT(*) FROM ${likes} WHERE ${likes.postId} = ${posts.id})`.as(
            'likesCount'
          ),
        repliesCount:
          sql<number>`(SELECT COUNT(*) FROM ${replies} WHERE ${replies.postId} = ${posts.id})`.as(
            'repliesCount'
          ),
        repostsCount:
          sql<number>`(SELECT COUNT(*) FROM ${reposts} WHERE ${reposts.postId} = ${posts.id})`.as(
            'repostsCount'
          ),
      })
      .from(posts)
      .leftJoin(users, eq(users.id, posts.userId))
      .where(eq(posts.id, Number(id)))
      .limit(1)

    if (post.length === 0) {
      throw new Error('Post not found')
    }

    const repliesData = await db
      .select({
        id: replies.id,
        content: replies.content,
        createdAt: replies.createdAt,
        user: {
          name: users.username,
          avatar: users.avatarUrl,
        },
      })
      .from(replies)
      .leftJoin(users, eq(users.id, replies.userId))
      .where(eq(replies.postId, Number(id)))

    return {
      ...post[0],
      replies: repliesData,
    }
  } catch (error) {
    throw new Error(`Failed to fetch post: ${(error as Error).message}`)
  }
}

export function PostPage() {
  const data = useLoader(loader)

  const navigation = useNavigation()
  const params = useParams<any>()

  useEffect(() => {
    navigation.setOptions({ title: data?.content || `Post #${params.id}` })
  }, [navigation, data?.content, params.id])

  if (!data) {
    return null
  }

  return (
    <>
      <PageContainer>
        <FeedCard {...data} disableLink />
        {data.replies && data.replies.length > 0 && (
          <YStack
            marginLeft="$7"
            borderLeftWidth={1}
            borderRightWidth={1}
            borderColor="$borderColor"
          >
            {data.replies.map((reply) => (
              <FeedCard key={reply.id} {...reply} disableLink isReply />
            ))}
          </YStack>
        )}
      </PageContainer>
    </>
  )
}
