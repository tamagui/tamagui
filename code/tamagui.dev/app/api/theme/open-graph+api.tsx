import { createServerClient } from '@supabase/ssr'
import { ImageResponse } from '@vercel/og'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { getTheme } from '../../../features/studio/theme/getTheme'

export async function GET(req: Request) {
  const supabase = createServerClient(
    import.meta.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        getAll() {
          return []
        },
      },
    }
  )

  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return new Response('No id provided', { status: 400 })
    }

    let theme = await getTheme(id, req)
    if (!theme) {
      return
    }

    if (theme.is_cached && theme.og_image_url) {
      const { data, error } = await supabase.storage
        .from('theme-og-images')
        .download(theme.og_image_url)

      if (!error && data) {
        return new Response(data, {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        })
      }
    }
    const berkeleyFont = readFileSync(join(process.cwd(), 'public/fonts/berkeley.otf'))
    const interBoldFont = readFileSync(join(process.cwd(), 'public/fonts/Inter-Bold.otf'))

    const hslToColor = (h, s, l) => `hsl(${h}, ${s * 100}%, ${l * 100}%)`

    const baseColors = theme.theme.palettes.base.anchors.map((c) =>
      hslToColor(c.hue.light, c.sat.light, c.lum.light)
    )
    const accentColors = theme.theme.palettes.accent.anchors.map((c) =>
      hslToColor(c.hue.light, c.sat.light, c.lum.light)
    )

    const baseColorsLight = theme.theme.palettes.base.anchors.map((c) =>
      hslToColor(c.hue.light, c.sat.light, c.lum.light)
    )
    const accentColorsLight = theme.theme.palettes.accent.anchors.map((c) =>
      hslToColor(c.hue.light, c.sat.light, c.lum.light)
    )
    const baseColorsDark = theme.theme.palettes.base.anchors.map((c) =>
      hslToColor(c.hue.dark, c.sat.dark, c.lum.dark)
    )
    const accentColorsDark = theme.theme.palettes.accent.anchors.map((c) =>
      hslToColor(c.hue.dark, c.sat.dark, c.lum.dark)
    )

    const image = new ImageResponse(
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundImage: `linear-gradient(-45deg, ${baseColors[0]} 50%, ${accentColors[0]} 50%)`,
          color: 'hsl(220, 5%, 3%)',
          padding: '48px',
          fontFamily: 'system-ui',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '48px',
            left: '48px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div style={{ width: '40px', height: '40px', opacity: 0.9, display: 'flex' }}>
            <TamaguiLogo size={40} />
          </div>
          <div
            style={{
              fontSize: 28,
              color: 'hsl(220, 5%, 3%)',
              fontWeight: 500,
            }}
          >
            Tamagui Theme
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            top: '100px',
            left: '48px',
            fontWeight: 'bold',
            fontFamily: 'Berkeley Mono',
            fontSize:
              theme.search.length <= 5 ? 160 : theme.search.length <= 10 ? 140 : 120,
          }}
        >
          {theme.search}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            left: '48px',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Light Base */}
              <div
                style={{
                  display: 'flex',
                  fontSize: 24,
                  marginBottom: '16px',
                  opacity: 0.8,
                }}
              >
                Base
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  justifyContent: 'flex-end',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontSize: 20,
                    opacity: 0.8,
                  }}
                >
                  Light
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {baseColorsLight.map((color, i) => (
                    <div
                      key={`light-base-${i}`}
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        backgroundColor: color,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                      }}
                    />
                  ))}
                </div>
              </div>
              {/* Dark Base */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  justifyContent: 'flex-end',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontSize: 20,
                    opacity: 0.8,
                  }}
                >
                  Dark
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {baseColorsDark.map((color, i) => (
                    <div
                      key={`dark-base-${i}`}
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        backgroundColor: color,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div
                style={{
                  display: 'flex',
                  fontSize: 24,
                  marginBottom: '16px',
                  opacity: 0.8,
                }}
              >
                Accent
              </div>
              {/* Light Accent */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    display: 'flex',
                    fontSize: 20,
                    opacity: 0.8,
                  }}
                >
                  Light
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {accentColorsLight.map((color, i) => (
                    <div
                      key={`light-accent-${i}`}
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        backgroundColor: color,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                      }}
                    />
                  ))}
                </div>
              </div>
              {/* Dark Accent */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  justifyContent: 'flex-end',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontSize: 20,
                    opacity: 0.8,
                  }}
                >
                  Dark
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {accentColorsDark.map((color, i) => (
                    <div
                      key={`dark-accent-${i}`}
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        backgroundColor: color,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Berkeley Mono',
            data: berkeleyFont,
            style: 'normal',
            weight: 600,
          },
          {
            name: 'Inter',
            data: interBoldFont,
            style: 'normal',
            weight: 700,
          },
        ],
      }
    )

    const image2 = new ImageResponse(
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundImage: `linear-gradient(-45deg, ${accentColorsDark[0]} 50%, ${accentColorsLight[0]} 50%)`,
          color: 'hsl(220, 5%, 3%)',
          padding: '48px',
          fontFamily: 'system-ui',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '48px',
            left: '48px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div style={{ width: '40px', height: '40px', opacity: 0.9, display: 'flex' }}>
            <TamaguiLogo size={40} />
          </div>
          <div
            style={{
              fontSize: 28,
              color: 'hsl(220, 5%, 3%)',
              fontWeight: 500,
            }}
          >
            Tamagui Theme
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            top: '100px',
            left: '48px',
            fontWeight: 'bold',
            fontFamily: 'Berkeley Mono',
            fontSize: theme.search.length <= 5 ? 160 : 140,
          }}
        >
          {theme.search}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            left: '48px',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div
                style={{
                  display: 'flex',
                  fontSize: 24,
                  marginBottom: '16px',
                  opacity: 0.8,
                }}
              >
                Dark Mode
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  justifyContent: 'flex-end',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontSize: 20,
                    opacity: 0.8,
                  }}
                >
                  Base
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {baseColorsDark.map((color, i) => (
                    <div
                      key={`light-base-${i}`}
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        backgroundColor: color,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                      }}
                    />
                  ))}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  justifyContent: 'flex-end',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontSize: 20,
                    opacity: 0.8,
                  }}
                >
                  Accent
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {accentColorsDark.map((color, i) => (
                    <div
                      key={`dark-base-${i}`}
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        backgroundColor: color,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div
                style={{
                  display: 'flex',
                  fontSize: 24,
                  marginBottom: '16px',
                  opacity: 0.8,
                }}
              >
                Light Mode
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  justifyContent: 'flex-end',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontSize: 20,
                    opacity: 0.8,
                  }}
                >
                  Base
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {baseColorsLight.map((color, i) => (
                    <div
                      key={`light-accent-${i}`}
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        backgroundColor: color,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                      }}
                    />
                  ))}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  justifyContent: 'flex-end',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontSize: 20,
                    opacity: 0.8,
                  }}
                >
                  Accent
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {accentColorsLight.map((color, i) => (
                    <div
                      key={`dark-accent-${i}`}
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        backgroundColor: color,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Berkeley Mono',
            data: berkeleyFont,
            style: 'normal',
            weight: 600,
          },
          {
            name: 'Inter',
            data: interBoldFont,
            style: 'normal',
            weight: 700,
          },
        ],
      }
    )

    const buffer = await image.arrayBuffer()
    const imageBuffer = Buffer.from(buffer)

    queueMicrotask(async () => {
      try {
        if (theme.og_image_url) {
          await supabase.storage.from('theme-og-images').remove([theme.og_image_url])
        }

        const fileName = `theme-${id}-${Date.now()}.png`
        const { error: uploadError } = await supabase.storage
          .from('theme-og-images')
          .upload(fileName, imageBuffer, {
            contentType: 'image/png',
            cacheControl: '31536000',
          })

        if (uploadError) {
          console.error('Storage error:', uploadError)
          return
        }

        const { error: updateError } = await supabase
          .from('theme_histories')
          .update({
            og_image_url: fileName,
            is_cached: true,
          })
          .eq('id', id)

        if (updateError) {
          console.error('DB update error:', updateError)
        } else {
          console.info('DB update success:', fileName)
        }
      } catch (error) {
        console.error('Background storage/update error:', error)
      }
    })

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('OG image generation error:', error)
    return new Response('Error generating image', { status: 500 })
  }
}

const fallbackTheme = {
  base: [
    {
      hue: {
        dark: 220,
        sync: true,
        light: 220,
      },
      lum: {
        dark: 0.02,
        light: 0.99,
      },
      sat: {
        dark: 0.05,
        sync: true,
        light: 0.05,
      },
      index: 0,
    },
    {
      hue: {
        dark: 220,
        sync: true,
        light: 220,
        syncLeft: true,
      },
      lum: {
        dark: 0.15,
        light: 0.85,
      },
      sat: {
        dark: 0.05,
        sync: true,
        light: 0.05,
      },
      index: 4,
    },
    {
      hue: {
        dark: 220,
        sync: true,
        light: 220,
        syncLeft: true,
      },
      lum: {
        dark: 0.5,
        light: 0.5,
      },
      sat: {
        dark: 0.05,
        sync: true,
        light: 0.05,
      },
      index: 9,
    },
    {
      hue: {
        dark: 220,
        sync: true,
        light: 220,
        syncLeft: true,
      },
      lum: {
        dark: 0.85,
        light: 0.15,
      },
      sat: {
        dark: 0.05,
        sync: true,
        light: 0.05,
      },
      index: 10,
    },
    {
      hue: {
        dark: 220,
        sync: true,
        light: 220,
        syncLeft: true,
      },
      lum: {
        dark: 0.98,
        light: 0.03,
      },
      sat: {
        dark: 0.05,
        sync: true,
        light: 0.05,
      },
      index: 11,
    },
  ],
  model: 'claude-3-7-sonnet',
  reply:
    "<thinking>\nFor a Vercel-inspired theme, I'll create a clean, modern palette based on their brand. Vercel uses a minimalist black and white aesthetic with blue accents. I'll create a subtle theme with a clean base and blue accent palette that matches their brand identity.\n</thinking>\n\n0: 220,220 .05,.05 .99,.02\n4: 220,220 .05,.05 .85,.15\n9: 220,220 .05,.05 .5,.5\n10: 220,220 .05,.05 .15,.85\n11: 220,220 .05,.05 .03,.98\n\n0: 225,225 .7,.7 .65,.3\n4: 225,225 .7,.7 .55,.4\n9: 225,225 .7,.7 .45,.55\n10: 225,225 .7,.7 .25,.75\n11: 225,225 .7,.7 .1,.9",
  accent: [
    {
      hue: {
        dark: 225,
        sync: true,
        light: 225,
      },
      lum: {
        dark: 0.3,
        light: 0.65,
      },
      sat: {
        dark: 0.7,
        sync: true,
        light: 0.7,
      },
      index: 0,
    },
    {
      hue: {
        dark: 225,
        sync: true,
        light: 225,
        syncLeft: true,
      },
      lum: {
        dark: 0.4,
        light: 0.55,
      },
      sat: {
        dark: 0.7,
        sync: true,
        light: 0.7,
      },
      index: 4,
    },
    {
      hue: {
        dark: 225,
        sync: true,
        light: 225,
        syncLeft: true,
      },
      lum: {
        dark: 0.55,
        light: 0.45,
      },
      sat: {
        dark: 0.7,
        sync: true,
        light: 0.7,
      },
      index: 9,
    },
    {
      hue: {
        dark: 225,
        sync: true,
        light: 225,
        syncLeft: true,
      },
      lum: {
        dark: 0.75,
        light: 0.25,
      },
      sat: {
        dark: 0.7,
        sync: true,
        light: 0.7,
      },
      index: 10,
    },
    {
      hue: {
        dark: 225,
        sync: true,
        light: 225,
        syncLeft: true,
      },
      lum: {
        dark: 0.9,
        light: 0.1,
      },
      sat: {
        dark: 0.7,
        sync: true,
        light: 0.7,
      },
      index: 11,
    },
  ],
  scheme: 'light',
}

type Theme = {
  theme_data: typeof fallbackTheme
  search_query: string
  id: number
  user_id: string
  og_image_url: string | null
  is_cached: boolean | null
}

const TamaguiLogo = ({ size = 64 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <g id="favicon" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <rect id="Rectangle" fill="#000000" x="11" y="4" width="14" height="8"></rect>
      <path
        d="M2,22 L2,20 L4,20 L4,18 L6,18 L6,16 L8,16 L8,6 L10,6 L10,2 L14,2 L14,0 L24,0 L24,2 L26,2 L26,4 L28,4 L28,8 L32,8 L32,10 L30,10 L30,12 L32,12 L32,14 L30,14 L30,16 L28,16 L28,20 L30,20 L30,22 L32,22 L32,28 L30,28 L30,30 L26,30 L26,32 L8,32 L8,30 L4,30 L4,28 L2,28 L2,26 L0,26 L0,22 L2,22 Z M18,8 L16,8 L16,10 L18,10 L18,8 Z M24,6 L22,6 L22,8 L24,8 L24,6 Z"
        id="Combined-Shape"
        fill="#ECD20A"
      ></path>
    </g>
  </svg>
)
