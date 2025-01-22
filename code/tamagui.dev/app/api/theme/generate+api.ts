import { createDeepSeek } from '@ai-sdk/deepseek'
import { generateText } from 'ai'
import { apiRoute } from '~/features/api/apiRoute'
import { ensureAccess } from '~/features/api/ensureAccess'
import { ensureAuth } from '~/features/api/ensureAuth'
import { readBodyJSON } from '~/features/api/readBodyJSON'

if (!process.env.DEEPSEEK_API_KEY) {
  console.warn(`No DeepSeek API key!`)
}

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? '',
})

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
  const scheme = body.scheme?.trim() || 'unknown'

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

  const reasoning = false

  console.info(`Generating (reasoning: ${reasoning}): ${prompt}...`)

  const { text } = await generateText({
    model: deepseek(reasoning ? 'deepseek-reasoner' : 'deepseek-chat'),
    maxTokens: 3_000,
    prompt: `Help generate a Tamagui theme configuration for us. We need two sets of anchors,
which are just objects that define index, hue, sat, and lum for both light and dark modes.

We have a custom format to save space, it looks like this, this is a well formed theme with a grayscale base and blue accent:

---

i: 0
h: 0,0
s: 0.2,0.2
l: 0.99,0.02

i: 9
h: 0,0
s: 0.2,0.2
l: 0.5,0.5

i: 10
h: 0,0
s: 0.2,0.2
l: 0.15,0.925

i: 11
h: 0,0
s: 0.2,0.2
l: 0.03,0.98

###

i: 0
h: 250,250
s: 0.5,0.5
l: 0.4,0.35

i: 9
h: 250,250
s: 0.5,0.5
l: 0.65,0.6

i: 10
h: 250,250
s: 0.5,0.5
l: 0.95,0.9

i: 11
h: 250,250
s: 0.5,0.5
l: 0.95,0.95

Note that "i" = index, "h" = hue, "s" = saturation, "l" = luminosity. And the two values for each are dark, light values.

Base is the first section, accent is the second, separated by "###".

This is the way we generate two palettes - accent and base, which are just strings of colors from 0 to 11 index.
Note that index 0 to 9 are backgrounds, and 11 and 12 are foregrounds (text color).

We generate it for both light and dark mode using comma separation. So for dark mode the lum should be low
(0 to 0.2 or so) for index 0, medium (0.4 to 0.8 or so) for index 9, and then pretty high for 10, and highest at 11.
Likewise for light it should be dark at 0, medium at 9, and then very light at 10 and lightest at 11.

Note that "base" is your low level theme, while "accent" will generate a complimentary theme. So if the user
wants a black and white theme with a pop of red color, you'd generate "base" no saturation, and you'd generate
"accent" with hue at red, and high saturation values.

But if the user wanted a black and white theme where the *text* color is yellow, but the *accent* colors are green, you'd
generate the "base" to have index 0-9 have no saturation, but both 10 and 11 anchors would change the hue to be red.
Then accent would have hue all set to green.

Some notes:

  - Values always go light,dark. Make sure light is first, dark is second.
  - Luminosity for base dark themes background (index 0) should generally be low, light should be high.
  - Luminosity for base light theme foreground (index 10, 11) should generally be high, for dark low.
  - If you want colorful text, don't make the luminosity too close to the edge, something like 0.6 and 0.7 rather than 0.9 and 0.95.
  - For a more colorful background you also want the lum values at index 0/9 to be more towards the middle.
  - For example if they said "bright neon" you'd probably set the 0 anchor luminosity to be dark "0.4" and light "0.6" so the background of the background appear brighter.
  - Don't be afraid to make the base theme have stronger luminosity/sat, for example if the user asks for a sports team, make the background a bit more luminous and saturated to match it exactly, and only make the accent theme use the secondary color.
  - If there are three colors, you can use base background for one, base foreground for another, and accent for the third.
  - For high contrast themes, ensure that the luminosity for 0 index and 9 index are more spread apart.
  - In general the light 0 index luminosity should be close to 1 unless its a very vibrant theme, rule of thumb
    - light theme backgrounds look good when they are very light (close to 0.99)
    - otherwise if vibrant, go way down to 0.5 or so, avoid the "muddy" 0.9"
  - For strictly black and white themes, ensure there's no saturation on base or accent.
  - In general for text to look good you need your 10 and 11 index to contrast well the 0 and 9 index, for example a light theme generally wants high luminosity for 0 and 9, and low luminosity for 10 and 11.
  - You almost always want the hue of the 0-9 to match, and the hue of the 10-11 to match, but they can be different from each other.
  - You never want the 0 and 9 luminosity to be too close together, even low contrast themes should spread luminosity on them at least 0.4 or so.
  - If the user wants more subtle or more strong border color, then you want to add one additional anchor, at index 2, which is where borders are generally retrieved from. Make it closer or further away from the 0 anchor to make it more subtle or less, respectively.
  - Generally you want the "9" index to be exact match for specific colors you want to show in the UI. EG if you are doing pink and yellow for easter, try and make 9 index be the strongest pink/green.
  - Ensure the accent foreground is separated a good amount from background, or else it will look bad.

Here's a more punchy example of an "LA Lakers" theme with purple/gold, note the accent theme uses the gold for bg and purple for text,
and adds an anchor at index 3 to make borders a bit more subtle:

i: 0
h: 270,270
s: 0.8,0.8
l: 1,0.05

i: 3
h: 270,270
s: 0.8,0.8
l: 0.97,0.1

i: 9
h: 270,270
s: 0.8,0.8
l: 0.4,0.6

i: 10
h: 270,270
s: 0.8,0.8
l: 0.15,0.925

i: 11
h: 270,270
s: 0.8,0.8
l: 0.05,0.96

###

i: 0
h: 55,55
s: 0.9,0.9
l: 0.7,0.4

i: 9
h: 55,55
s: 0.9,0.9
l: 0.4,0.65

i: 10
h: 270,270
s: 0.9,0.9
l: 0.3,0.4

i: 11
h: 270,270
s: 0.9,0.9
l: 0.2,0.5

And here's a final of really bold theme. It has bright neon green base. It makes the accent background black and white, which is a good strategy generally for more bold themes.
But it uses a final pink foreground in the accent:

i: 0
h: 100,100
s: 0.9,0.9
l: 0.5,0.34

i: 9
h: 100,100
s: 0.9,0.9
l: 0.3,0.5

i: 10
h: 100,100
s: 0.9,0.9
l: 0.1,0.7

i: 11
h: 100,100
s: 0.9,0.9
l: 0,1

###

i: 0
h: 300,300
s: 0,0
l: 1,0

i: 9
h: 300,300
s: 0,0
l: 0.65,0.6

i: 10
h: 300,300
s: 0.5,0.5
l: 0.4,0.6

i: 11
h: 300,300
s: 0.5,0.5
l: 0.3,0.7

Here's the current color scheme they are using, which may be relevant: "${scheme}". For example if they say
"black theme" and are in dark mode, it means generate pure black background for dark, but pure white for light.

Please take four sentences to plan out your design in plain english with minimal formatting before returning structured data.
First, decide which of the themes above first you feel this one is most like. Then use that as a base but feel free to adjust to your taste,
you can even add anchors if the theme requires many colors.
  
${
  reasoning
    ? `Please don't overthink, reply quickly with just a few short thoughts.`
    : `After your plan please separate with a "---" before the structured data.`
}

BE SURE that you return ONLY the structured data after you think, with no english text, just a data with "###" separating base and accent.

The user prompt is "${prompt}".
`,
  })

  try {
    console.info(`Generated: ${text}`)
    const json = outputToJSON(text)
    return Response.json({
      result: json,
    })
  } catch (err) {
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
  const startOfData = text.indexOf('i: ')

  if (startOfData < 0) {
    throw new Error(`Invalid format, no i: `)
  }

  const [base, accent] = text
    .replace(/.*---/, '')
    .replace(/---.*/, '')
    // remove code blocks around it
    .slice(startOfData)
    .split('###')

  const baseAnchors = parseAnchors(base.trim())
  const accentAnchors = parseAnchors(accent.trim())

  return {
    base: baseAnchors,
    accent: accentAnchors,
  }
}

function parseAnchors(text: string) {
  const anchors = text.split('\n\n')

  return anchors.map((a) => {
    const [i, h, s, l] = a.split('\n')
    const index = +i.replace('i: ', '')

    return {
      index,
      hue: parseDarkLight('h', h, index),
      sat: parseDarkLight('s', s, index),
      lum: parseDarkLight('l', l, index),
    }
  })
}

function parseDarkLight(name: 'h' | 's' | 'l', line: string, index: number) {
  const [light, dark] = line
    .replace(/[a-z]\:\s+/, '')
    .split(',')
    .map((x) => +x)
  return {
    dark,
    light,
    ...(index === 0 &&
      (name === 'h' || name === 's') && {
        sync: true,
      }),
    ...(index > 0 &&
      index <= 9 &&
      (name === 'h' || name === 's') && {
        syncLeft: true,
        sync: true,
      }),
    ...(index === 10 &&
      (name === 'h' || name === 's') && {
        sync: true,
      }),
    ...(index === 11 &&
      (name === 'h' || name === 's') && {
        syncLeft: true,
        sync: true,
      }),
  }
}
