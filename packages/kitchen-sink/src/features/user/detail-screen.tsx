import { Button, Paragraph, YStack } from '@my/ui'
import { ChevronLeft } from '@tamagui/feather-icons'
import React from 'react'
import { createParam } from 'solito'
import { Link } from 'solito/link'

const { useParam } = createParam<{ id: string }>()

export function UserDetailScreen() {
  const [id] = useParam('id')

  return (
    <YStack f={1} jc="center" ai="center" space>
      <Paragraph ta="center" fow="800">{`User ID: ${id}`}</Paragraph>
      <Link href="/">
        <Button icon={ChevronLeft}>
          Go Home
        </Button>
      </Link>
    </YStack>
  )
}
