import { anthropic } from '@ai-sdk/anthropic'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import slugify from '@sindresorhus/slugify'
import { generateText } from 'ai'
import { z } from 'zod'
import { apiRoute } from '~/features/api/apiRoute'
import { ensureAccess } from '~/features/api/ensureAccess'
import { ensureAuth } from '~/features/api/ensureAuth'
import { readBodyJSON } from '~/features/api/readBodyJSON'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'
import type { ThemeSuiteItemData } from '~/features/studio/theme/types'

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

const modelChain = [
  { name: 'claude-sonnet-4-6', create: () => anthropic('claude-sonnet-4-6') },
  { name: 'qwen/qwen3-max', create: () => openrouter('qwen/qwen3-max') },
]

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

function convertToThemeSuiteItemData(
  base: any[],
  accent: any[],
  prompt: string
): ThemeSuiteItemData {
  return {
    name: prompt,
    palettes: {
      base: {
        name: 'base',
        anchors: base,
      },
      accent: {
        name: 'accent',
        anchors: accent,
      },
    },
    schemes: {
      light: true,
      dark: true,
    },
    templateStrategy: 'base',
  }
}

export default apiRoute(async (req) => {
  const { user } = await ensureAuth({ req })

  try {
    const { hasPro } = await ensureAccess({ user })

    console.info(`[theme/generate] user=${user.email} hasPro=${hasPro}`)

    if (!hasPro) {
      console.info(`[theme/generate] user=${user.email} denied - no Pro access`)
      throw Response.json(
        {
          error: `Must have Pro account`,
        },
        {
          status: 400,
        }
      )
    }
  } catch (err) {
    // re-throw Response errors as-is
    if (err instanceof Response) {
      throw err
    }
    console.error(`[theme/generate] user=${user.email} access check error:`, err)
    throw Response.json(
      {
        error: `Must have Pro account`,
      },
      {
        status: 400,
      }
    )
  }

  const body = await readBodyJSON(req)
  const prompt = body.prompt?.trim()
  const lastId = body.lastId?.trim() || ''
  const lastReply = body.lastReply?.trim() || ''
  const lastPrompt = body.lastPrompt?.trim() || ''
  const scheme = body.scheme?.trim() || 'unknown'
  const action = body.action

  // Handle delete action
  if (action === 'delete' && lastId) {
    const { data: themeToDelete } = await supabaseAdmin
      .from('theme_histories')
      .select()
      .eq('id', lastId)
      .single()

    if (!themeToDelete) {
      throw Response.json({ error: 'Theme not found' }, { status: 404 })
    }

    if (themeToDelete.user_id !== user.id) {
      throw Response.json(
        { error: 'Not authorized to delete this theme' },
        { status: 403 }
      )
    }

    await supabaseAdmin
      .from('theme_histories')
      .delete()
      .eq('id', lastId)
      .eq('user_id', user.id)

    return Response.json({
      success: true,
      message: 'Theme deleted successfully',
    })
  }

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

  console.info(`Generating (scheme: ${scheme}): ${prompt}...`)

  const fullPrompt = `
Help generate themes that contain two light + dark color palettes. The new
Tamagui palette system generates base and accent palettes in dark and light.
Each palette has 12 items, from index 1 to 12, to save space you can leave
out indices and we spread between.

Each row gives hue/sat/lum pairs of light,dark, like this:

index: light-hue,dark-hue light-sat,dark-sat light-lum,dark-lum

Here's an example of a subtle theme a desaturated base, and blue accent:

1: 0,0 .2,.2 .99,.02
10: 0,0 .2,.2 .5,.5
11: 0,0 .2,.2 .15,.925
12: 0,0 .2,.2 .03,.98

1: 250,250 .5,.5 .6,.35
10: 250,250 .5,.5 .5,.6
11: 250,250 .5,.5 .2,.9
12: 250,250 .5,.5 .1,.95

For example here's a more bright theme for neopolitan ice cream:

1: 324,324 .35,.35 .92,.06
10: 324,324 .7,.7 .5,.5
11: 23,23 .6,.6 .22,.6
12: 23,23 .85,.85 .03,.67

1: 54,54 .12,.12 .99,.3
10: 54,54 .12,.12 .6,.6
11: 54,54 .12,.12 .3,.9
12: 54,54 .12,.12 .2,.99

Notes:

- If the user asks for specifics as to colors, indices, then do that instead
  of any specific instructions here.

- Always be sure to have the 1-3 have good contrast against 10-12 - enough to
  read text on bg - mostly using lum.
  
- For a more fun theme free to change hue from 1 to 10.

- Foregrounds always need to stand out from backgrounds (and accent fg can
  sometimes be set on base bg)
  
- In general set just a few anchors, usually 1, 10, 11, 12, maybe a few more,
  and make sure the hue values most of the time match for 1-10 and for 11-12
  
- Don't be afraid to have a few different hues! If there's a secondary color
  make the accent 1-10 use it.
  
- If the user ants it bolder or brighter, you actually want to generally make the 1
  index lumonisity closer to the middle, so if dark theme 1 is 0.1, make it like 0.3.
  In general if a theme calls for a more vibrant look (eg a sports team, or well known
  symbolic colors), then make the 1 index close to the actual desired brand color.

- For more wild themes, a hue that changes between base 1-10 can have an epic effect, like a sunset
  
- Generally 1 to 8 are backgrounds, 10 to 12 are foregrounds.
    
- In general for text to look good you need your 11 and 12 index to contrast well the 1 through 7.
  
- Dark themes usually start darker at 1 and go lighter, while the light does the opposite (1 index is light).

- Accent 12 must look good on top of accent 4 - don't clash them too much.

- Adding an anchor at index 5 even if it just slightly changes hue or accelerates
saturation, makes for a more interesting theme, it's generally nice especially
the more hues you need as you can do it on both accent and base. Another hue change at 11
also often looks good if you need more colors.

- A white bg in light mode / black bg in dark mode often looks good, but if the theme calls
  for multiple colors, then you generally want base to use 1-2 of those colors.

${
  lastReply
    ? `
The user is refining their previous theme, here's their previous prompt:

<last-prompt>${lastPrompt}</last-prompt>

They are currently viewing in ${scheme} mode.

And the theme they are refining, use this to iterate on the new one:

<last-reply>
${(lastReply ?? '').replace(/\s+/, ' ')}
</last-reply>

Notes on refining:

- be more conservative with changes, if they specify "light" then don't change the dark theme.
- our old system we had "0" index, if you see it starts with 0:, please remap all anchors + 1 index.
`
    : ``
}

Here's the new prompt:

<prompt>${prompt.replace(/\s+/, ' ')}</prompt>

${lastReply ? `Note that since they are refining, unless they explicitly refer to the "accent" theme, assume they are talking about the base theme.` : ``}

When you respond, start with a <thinking /> first to plan, then end output just the exact structured data.
Don't add headers, backticks, or any labels around the structured data.
`

  let text = ''

  for (const { name, create } of modelChain) {
    try {
      console.info(`[theme/generate] trying model=${name}`)
      const result = await generateText({
        model: create(),
        maxTokens: 4_000,
        prompt: fullPrompt,
      })
      text = result.text
      console.info(`[theme/generate] success model=${name}`)
      break
    } catch (err) {
      console.error(`[theme/generate] model=${name} failed:`, err)
    }
  }

  if (!text) {
    throw Response.json({ error: 'All models failed to generate' }, { status: 502 })
  }

  try {
    console.info(`Generated: ${text}`)

    const { base, accent } = themeTextToJSON(text)

    palette.parse(base)
    palette.parse(accent)

    const themeData = convertToThemeSuiteItemData(base, accent, prompt)

    let nextId = lastId

    // First check if a record already exists
    if (lastId) {
      const { data: existingData } = await supabaseAdmin
        .from('theme_histories')
        .select()
        .eq('id', lastId)
        .eq('user_id', user.id)
        .single()

      if (existingData) {
        // Update existing record
        await supabaseAdmin
          .from('theme_histories')
          .update({
            theme_data: themeData,
            updated_at: new Date().toISOString(),
            is_cached: false,
          })
          .eq('id', lastId)

        nextId = existingData.id
      } else {
        // If we have a lastId but couldn't find the theme, create a new one
        const { data, error } = await supabaseAdmin
          .from('theme_histories')
          .insert({
            user_id: user.id,
            search_query: prompt,
            theme_data: themeData,
            updated_at: new Date().toISOString(),
            is_cached: false,
          })
          .select()

        if (error) {
          console.error(`Error saving theme history: ${error}`)
        }

        nextId = data?.[0]?.id || ''
      }
    } else {
      const { data, error } = await supabaseAdmin
        .from('theme_histories')
        .insert({
          user_id: user.id,
          search_query: prompt,
          theme_data: themeData,
          updated_at: new Date().toISOString(),
          is_cached: false,
        })
        .select()

      if (error) {
        console.error(`Error saving theme history: ${error}`)
      }

      nextId = data?.[0]?.id || ''
    }

    return Response.json({
      result: themeData,
      reply: text,
      searchQuery: prompt,
      themeId: nextId,
      slug: slugify(prompt),
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

function themeTextToJSON(text: string) {
  const [base, accent] = parsePalettes(text)
  const baseAnchors = parseAnchors(base.trim())
  const accentAnchors = parseAnchors(accent.trim())

  return {
    base: baseAnchors,
    accent: accentAnchors,
  }
}

function parsePalettes(textIn: string): string[] {
  const endThinking = textIn.indexOf('</thinking>')
  const text = endThinking > 0 ? textIn.slice(endThinking) : textIn

  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  const firstZeroIndex = lines.findIndex((line) => line.startsWith('1: '))
  if (firstZeroIndex === -1) return []

  const relevantLines = lines.slice(firstZeroIndex)
  const parts: string[][] = []
  let currentPart: string[] = []

  for (const line of relevantLines) {
    if (line.startsWith('1: ')) {
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

  const anchorsOut = addSyncs(
    anchors.map((a) => {
      const [i, h, s, l] = a.split(/\s+/)
      // move index down 1 to account for 0 index
      const index = +i.replace(':', '').trim() - 1
      return {
        index,
        hue: parseDarkLight(h),
        sat: parseDarkLight(s),
        lum: parseDarkLight(l),
      }
    })
  )

  return anchorsOut
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
