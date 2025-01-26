import { anthropic } from '@ai-sdk/anthropic'
import { deepseek } from '@ai-sdk/deepseek'
import { openai } from '@ai-sdk/openai'
import { xai } from '@ai-sdk/xai'
import { generateText } from 'ai'
import { z } from 'zod'
import { apiRoute } from '~/features/api/apiRoute'
import { ensureAccess } from '~/features/api/ensureAccess'
import { ensureAuth } from '~/features/api/ensureAuth'
import { readBodyJSON } from '~/features/api/readBodyJSON'

const models = {
  'grok-beta': xai('grok-beta'),
  'grok-2-1212': xai('grok-2-1212'),
  'deepseek-chat': deepseek(`deepseek-chat`),
  'deepseek-reasoner': deepseek(`deepseek-reasoner`),
  'claude-3-5-sonnet-latest': anthropic('claude-3-5-sonnet-latest'),
  'claude-3-5-haiku-latest': anthropic('claude-3-5-haiku-latest'),
  'gpt-4o-mini': openai('gpt-4o-mini'),
  'gpt-4o': openai('gpt-4o'),
  'gpt-4': openai('gpt-4'),
  'gpt-4-turbo': openai('gpt-4-turbo'),
}

type ModelName = keyof typeof models

const lightDarkVal = z.object({
  light: z.number(),
  dark: z.number(),
  syncLeft: z.optional(z.boolean()),
  sync: z.optional(z.boolean()),
})

const palette = z.array(
  z.object({
    index: z.number(),
    hue: lightDarkVal,
    sat: lightDarkVal,
    lum: lightDarkVal,
  })
)

export default apiRoute(async (req) => {
  const { supabase } = await ensureAuth({ req })

  try {
    const { hasTakeoutAccess, hasBentoAccess } = await ensureAccess({ req, supabase })

    if (!(hasTakeoutAccess || hasBentoAccess)) {
      throw Response.json(
        {
          error: `First purchase Takeout or Bento!`,
        },
        {
          status: 400,
        }
      )
    }
  } catch (err) {
    throw Response.json(
      {
        error: `First purchase Takeout or Bento!`,
      },
      {
        status: 400,
      }
    )
  }

  const body = await readBodyJSON(req)
  const prompt = body.prompt?.trim()
  const lastReply = body.lastReply?.trim() || ''
  const scheme = body.scheme?.trim() || 'unknown'
  const model = body.model?.trim()

  if (!prompt) {
    throw Response.json(
      {
        error: `No prompt!`,
      },
      {
        status: 400,
      }
    )
  }

  if (prompt.length > 1000) {
    throw Response.json(
      {
        error: `Prompt too long!`,
      },
      {
        status: 400,
      }
    )
  }

  const modelName: ModelName = model in models ? model : 'gpt-4-turbo'

  console.info(`Generating (scheme: ${scheme}, model: ${modelName}): ${prompt}...`)

  const { text } = await generateText({
    model: models[modelName],
    maxTokens: 4_000,
    onStepFinish(event) {
      console.info(event.text)
    },
    // experimental_output: Output.object({
    //   schema: z.object({
    //     base: z.array(palette),
    //     accent: z.array(palette),
    //   }),
    // }),
    prompt: `Help generate themes that contain two light + dark color palettes.
The new Tamagui palette system generates base and accent palettes in dark and light.
Each palette has 12 items, from index 0 to 11, to save space you can leave out indices and we spread between.

Each row goes "index: hue,hue sat,sat lum,lum" in order of "light,dark":

0: 0,0 .2,.2 .99,.02
9: 0,0 .2,.2 .5,.5
10: 0,0 .2,.2 .15,.925
11: 0,0 .2,.2 .03,.98

0: 250,250 .5,.5 .4,.35
9: 250,250 .5,.5 .65,.6
10: 250,250 .5,.5 .95,.9
11: 250,250 .5,.5 .95,.95

These palettes are used to theme a website. The background is 0 index, and fonts are 9, 10, 11.
Some UI elements can use 2, 3, 4 for backgrounds as well. There are different types of palettes you can generate:

- Subtle: For many UI's you want a somewhat broad palette with pretty low lum at index 0 for dark mode,
and near-white for light mode. You want to work up to a more contrasting anchor 9, then make sure a pretty
strong contrast between 0 and 10.

- Brands, sports teams, needs exact colors:

Choose primary/secondary/tertiary colors.
In dark make accent and base bg 0 match primary/secondary, make the fg match tertiary etc.
In light the bg should be still near-white, instead match the 10 to primary, 11 to secondary.
You can change the hue in base light to different hue for fg so it can use secondary bg, primary fg.
If primary/secondary clash make accent FG less saturated / less close in lum.

- Bold: You can make both light and dark have a bold BG that matches the primary color, make 0-9 change less, be sure that fg still contrasts.
If you need a third and fourth primary colors, use the foregrounds (both 10 and 11).
You could make the palettes bend from 0-9 to light or dark, or make them not change much at all for really strong brands.

- Extreme, funny, super bold looks: You can have as many anchors as you want! Make a ton of them. Can have like 0: 1: 2: 3: 4: etc.
Prefer high saturation for these types of schemes.

Some notes:

  - THE NUMBER 0 INDEX AND THE NUMBER 10, 11 INDICES MUST BE FAR APART LUMINOSITY
  - Most themes don't change hue in 0-9, unless they are going for a lot of colors (or like a sunset shifting from yellow to orange).
  - Foregrounds always need to stand out from backgrounds (and accent fg can sometimes be set on base bg)
  - In general set just a few anchors, usually 0, 9, 10, 11, maybe a few more, and make sure the hue values most of the time match for 0-9 and for 10-11
  - Don't be afraid to have a few different hues! If there's a secondary color make the accent 0-9 use it.
  - Index 0 to 7 are backgrounds, and 9 to 12 are foregrounds, with 10 and 11 mostly used for text.
  - An inversed accent theme (dark to light) can work for a more contrasting look.
  - In general don't be afaid to use more anchors to add more colors.
  - If adding more hues you can add more anchors at new index
  - You can vary the 10 and 11 index foreground colors hue, but make sure to keep them distinct enough lum from 0
  - In general for text to look good you need your 10 and 11 index to contrast well the 0 and 9 index, for example a light theme generally wants high luminosity for 0 and 9, and low luminosity for 10 and 11.
  - Ensure the accent foreground (9-10) lum is far enough from the the accent bg (1) to read.
  - "More bright" to someone in dark mode usually means a anchor 0 that is closer to the middle luminescence, so base would go from l: 1,0 to l: 0.4,0.6
  - "More bright" to someone in light mode usually means the opposite - so l: 0.92,0.1 would go to l: 0.99,0.18

Here's a black and white theme showing how you can just inverse the accent theme:

0: 0,0 0,0 1,0
9: 0,0 0,0 .4,.6
10: 0,0 0,0 .1,.9
11: 0,0 0,0 0,1

0: 0,0 0,0 0,1
9: 0,0 0,0 .6,.4
10: 0,0 0,0 .9,.1
11: 0,0 0,0 1,0

Here's that theme, but with strong borders:

0: 0,0 0,0 1,0
4: 0,0 0,0 .4,.6
10: 0,0 0,0 .1,.9
11: 0,0 0,0 0,1

0: 0,0 0,0 0,1
4: 0,0 0,0 .6,.4
10: 0,0 0,0 .9,.1
11: 0,0 0,0 1,0

Here's another example of a more dressed up LA Lakers theme:

0: 270,270 .8,.8 .99,.05
9: 270,270 .8,.8 .4,.6
10: 270,270 .8,.8 .15,.925
11: 270,270 .8,.8 .05,.96

0: 55,55 .9,.9 .85,.3
9: 55,55 .9,.9 .4,.65
10: 270,270 .9,.9 .3,.4
11: 270,270 .9,.9 .2,.5

Here's that same theme with stronger borders:

0: 270,270 .8,.8 .99,.05
4: 270,270 .8,.8 .4,.6
9: 270,270 .8,.8 .3,.7
10: 270,270 .8,.8 .15,.925
11: 270,270 .8,.8 .05,.96

0: 55,55 .9,.9 .85,.3
4: 55,55 .9,.9 .4,.6
9: 55,55 .9,.9 .3,.7
10: 270,270 .9,.9 .3,.4
11: 270,270 .9,.9 .2,.5

Here's the current color scheme: "${scheme}" ONLY consider this if they say they want a "darker background".

The prompt is "${prompt.replace(/\s+/, ' ')}"

Make a plan in a few sentences, pick the number of colors you need, then hue values.
Then *only* give the structured data precisely in the right format at the end.
Don't write anything after or in between the structured data, don't label it, don't add backticks around it, just newlines and data:
`,
  })

  //${lastReply && lastReply !== prompt ? `The user had a prompt and weights last time, start your plan by deciding if relevant: "${lastReply}"` : ''}

  try {
    console.info(`Generated: ${text}`)
    const { base, accent, cleaned } = outputToJSON(text)

    palette.parse(base)
    palette.parse(accent)

    return Response.json({
      result: { base, accent },
      reply: cleaned,
    })
  } catch (err) {
    console.error(`Error generating: ${err}`)
    throw Response.json(
      {
        error: `Invalid JSON returned: ${err}`,
      },
      {
        status: 400,
      }
    )
  }
})

function outputToJSON(text: string) {
  const [base, accent] = parsePalettes(text)
  const baseAnchors = parseAnchors(base.trim())
  const accentAnchors = parseAnchors(accent.trim())

  return {
    base: baseAnchors,
    accent: accentAnchors,
  }
}

function parsePalettes(text: string): string[] {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  const firstZeroIndex = lines.findIndex((line) => line.startsWith('0: '))
  if (firstZeroIndex === -1) return []

  const relevantLines = lines.slice(firstZeroIndex)
  const parts: string[][] = []
  let currentPart: string[] = []

  for (const line of relevantLines) {
    if (line.startsWith('0: ')) {
      if (currentPart.length > 0) {
        parts.push(currentPart)
        currentPart = []
      }
    }
    if (/^\d+:/.test(line)) {
      currentPart.push(line)
    }
  }

  if (currentPart.length > 0) {
    parts.push(currentPart)
  }

  return parts.map((part) => part.join('\n'))
}

function parseAnchors(text: string) {
  const anchors = text.split('\n')

  return addSyncs(
    anchors.map((a) => {
      const [i, h, s, l] = a.split(/\s+/)
      const index = +i.replace(':', '').trim()
      return {
        index,
        hue: parseDarkLight(h),
        sat: parseDarkLight(s),
        lum: parseDarkLight(l),
      }
    })
  )
}

function parseDarkLight(line: string) {
  const [light, dark] = line.split(',').map((x) => Number.parseFloat(x))
  return {
    dark,
    light,
  }
}

function addSyncs(anchors: z.infer<typeof palette>) {
  for (const [index, anchor] of anchors.entries()) {
    const lastAnchor = anchors[index - 1]

    if (anchor.hue.light === lastAnchor?.hue.dark) {
      anchor.hue.syncLeft = true
    }
    if (anchor.sat.light === lastAnchor?.sat.dark) {
      anchor.hue.syncLeft = true
    }

    if (anchor.hue.light === anchor.hue.dark) {
      anchor.hue.sync = true
    }
    if (anchor.sat.light === anchor.sat.dark) {
      anchor.sat.sync = true
    }
  }

  return anchors
}
