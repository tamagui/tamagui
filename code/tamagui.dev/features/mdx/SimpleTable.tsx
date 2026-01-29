import type { Href } from 'one'
import type { ReactNode } from 'react'
import { Paragraph, ScrollView, styled, Text, useMedia, XStack, YStack } from 'tamagui'
import { Link } from '~/components/Link'

const TableFrame = styled(YStack, {
  my: '$4',
  borderWidth: 1,
  borderColor: '$borderColor',
  rounded: '$4',
  overflow: 'hidden',
})

const TableRow = styled(XStack, {
  borderBottomWidth: 1,
  borderBottomColor: '$borderColor',
  variants: {
    last: {
      true: {
        borderBottomWidth: 0,
      },
    },
  } as const,
})

const TableCellContainer = styled(YStack, {
  p: '$3',
  variants: {
    head: {
      true: {
        bg: '$color2',
      },
    },
  } as const,
})

const TableCellText = styled(Paragraph, {
  size: '$4',
  variants: {
    head: {
      true: {
        fontWeight: '600',
      },
    },
  } as const,
})

type CellContent = ReactNode

// Patterns: bold link, link, bold, inline code
const MARKDOWN_PATTERN =
  /(\*\*\[([^\]]+)\]\(([^)]+)\)\*\*)|(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)|(`([^`]+)`)/g

function parseCell(content: CellContent): ReactNode {
  if (typeof content !== 'string') return content

  const matches = [...content.matchAll(MARKDOWN_PATTERN)]
  if (!matches.length) return content

  const parts: ReactNode[] = []
  let lastIndex = 0

  matches.forEach((match, i) => {
    // Add text before match
    if (match.index! > lastIndex) {
      parts.push(content.slice(lastIndex, match.index))
    }

    // Bold link: **[text](url)**
    if (match[1]) {
      parts.push(
        <Link key={i} href={match[3] as Href}>
          <Text fontWeight="700">{match[2]}</Text>
        </Link>
      )
    }
    // Regular link: [text](url)
    else if (match[4]) {
      parts.push(
        <Link key={i} href={match[6] as Href}>
          {match[5]}
        </Link>
      )
    }
    // Bold: **text**
    else if (match[7]) {
      parts.push(
        <Text key={i} fontWeight="700">
          {match[8]}
        </Text>
      )
    }
    // Inline code: `text`
    else if (match[9]) {
      parts.push(
        <Text key={i} fontFamily="$mono" bg="$color4" px="$1.5" py="$0.5" rounded="$2">
          {match[10]}
        </Text>
      )
    }

    lastIndex = match.index! + match[0].length
  })

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex))
  }

  return parts.length === 1 ? parts[0] : parts
}

export function SimpleTable({
  headers,
  rows,
}: {
  headers: CellContent[]
  rows: CellContent[][]
}) {
  const colCount = headers.length
  const colWidth = `${100 / colCount}%` as `${number}%`
  const media = useMedia()
  const isMobile = media.sm

  const table = (
    <TableFrame {...(isMobile && { minWidth: 760 })}>
      <TableRow>
        {headers.map((header, i) => (
          <TableCellContainer key={i} head width={colWidth}>
            <TableCellText head>{header}</TableCellText>
          </TableCellContainer>
        ))}
      </TableRow>
      {rows.map((row, i) => (
        <TableRow key={i} last={i === rows.length - 1}>
          {row.map((cell, j) => (
            <TableCellContainer key={j} width={colWidth}>
              <TableCellText>{parseCell(cell)}</TableCellText>
            </TableCellContainer>
          ))}
        </TableRow>
      ))}
    </TableFrame>
  )

  if (isMobile) {
    return <ScrollView horizontal>{table}</ScrollView>
  }

  return table
}
