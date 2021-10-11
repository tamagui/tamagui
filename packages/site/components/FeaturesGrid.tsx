import { VStack, Box, Title, Grid, Text, Paragraph } from 'snackui'

const Code = (props) => <code {...props} />

export function FeaturesGrid() {
  return (
    <VStack size={{ '@initial': '2', '@bp1': '3' }}>
      <VStack>
        <Title fontWeight="800" size="xl" textAlign="center" marginBottom="$2">
          Features
        </Title>
        <Paragraph size="lg" textAlign="center" marginBottom="$8">
          A fully-featured styling library.
        </Paragraph>

        <Grid
          gap={10}
          // css={{
          //   gap: '$6',
          //   gridTemplateColumns: '1fr',
          //   '@bp2': {
          //     gap: '$8',
          //     gridTemplateColumns: '1fr 1fr',
          //   },
          // }}
        >
          <Box>
            <Title
              fontWeight="800"
              size="5"
              as="h4"
              css={{ lineHeight: 1, fontWeight: 500, mb: '$2' }}
            >
              Performant
            </Title>
            <Paragraph
              as="p"
              size={{ '@initial': '4', '@bp2': '4' }}
              css={{ lineHeight: '27px', color: '$slate11' }}
            >
              Peaches avoids unnecessary prop interpolations at runtime, making it more performant
              than other styling libraries.
            </Paragraph>
          </Box>

          <Box>
            <Title
              fontWeight="800"
              size="5"
              as="h4"
              css={{ lineHeight: 1, fontWeight: 500, mb: '$2' }}
            >
              Server-side rendering
            </Title>

            <Paragraph
              as="p"
              size={{ '@initial': '4', '@bp2': '4' }}
              css={{ lineHeight: '27px', color: '$slate11' }}
            >
              Peaches supports cross-browser server-side rendering, even for responsive styles and
              variants.
            </Paragraph>
          </Box>

          <Box>
            <Title
              fontWeight="800"
              size="5"
              as="h4"
              css={{ lineHeight: 1, fontWeight: 500, mb: '$2' }}
            >
              Developer experience
            </Title>

            <Paragraph
              as="p"
              size={{ '@initial': '4', '@bp2': '4' }}
              css={{ lineHeight: '27px', color: '$slate11' }}
            >
              With a fully-typed API, token-aware properties, and custom utils.
            </Paragraph>
          </Box>

          <Box>
            <Title
              fontWeight="800"
              size="5"
              as="h4"
              css={{ lineHeight: 1, fontWeight: 500, mb: '$2' }}
            >
              Critical Path CSS
            </Title>

            <Paragraph
              as="p"
              size={{ '@initial': '4', '@bp2': '4' }}
              css={{ lineHeight: '27px', color: '$slate11' }}
            >
              Only inject the styles which are actually used, so your users don't download
              unnecessary CSS.
            </Paragraph>
          </Box>

          <Box>
            <Title
              fontWeight="800"
              size="5"
              as="h4"
              css={{ lineHeight: 1, fontWeight: 500, mb: '$2' }}
            >
              Override component tags
            </Title>

            <Paragraph
              as="p"
              size={{ '@initial': '4', '@bp2': '4' }}
              css={{ lineHeight: '27px', color: '$slate11' }}
            >
              A polymorphic <Code>as</Code> prop is included in components returned from the{' '}
              <Code>styled</Code> function.
            </Paragraph>
          </Box>

          <Box>
            <Title
              fontWeight="800"
              size="5"
              as="h4"
              css={{ lineHeight: 1, fontWeight: 500, mb: '$2' }}
            >
              Override component styles
            </Title>

            <Paragraph
              as="p"
              size={{ '@initial': '4', '@bp2': '4' }}
              css={{ lineHeight: '27px', color: '$slate11' }}
            >
              Provides a <Code>css</Code> prop, which allows style overrides to be applied in the
              consumption layer.
            </Paragraph>
          </Box>
        </Grid>
      </VStack>
    </VStack>
  )
}
