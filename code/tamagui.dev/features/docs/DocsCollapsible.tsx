import { ChevronDown } from '@tamagui/lucide-icons-2'
import type React from 'react'
import { Accordion, Paragraph, XStack, YStack } from 'tamagui'

// a single fold for docs pages: a quiet row with a chevron that opens into
// regular mdx block content. used from mdx as <Collapsible title="...">
export const DocsCollapsible = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => {
  return (
    <Accordion type="single" collapsible my="4">
      <Accordion.Item value="content">
        <Accordion.Trigger
          group="docs-collapsible"
          padding={0}
          backgroundColor="transparent hover:color-2 press:color-1"
          borderWidth={1}
          borderColor="color-4"
          borderRadius="4"
        >
          {({ open }: { open: boolean }) => (
            <XStack py="3" px="4" justify="space-between" items="center" width="100%">
              <Paragraph size="5" fontWeight="600" color="color-12">
                {title}
              </Paragraph>
              <YStack
                transition={{ preset: 'quick', properties: 'transform' }}
                opacity="0.4 group-hover/docs-collapsible:0.8"
                rotate={open ? '180deg' : '0deg'}
              >
                <ChevronDown color="color-10" size="1" />
              </YStack>
            </XStack>
          )}
        </Accordion.Trigger>

        <Accordion.HeightAnimator overflow="hidden" transition="200ms">
          <Accordion.Content
            px="4"
            py="2"
            transition="200ms"
            backgroundColor="transparent"
            opacity="exit:0"
          >
            {children}
          </Accordion.Content>
        </Accordion.HeightAnimator>
      </Accordion.Item>
    </Accordion>
  )
}
