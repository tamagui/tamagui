process.env.TAMAGUI_TARGET = 'web'

import { PassThrough } from 'node:stream'
import { Suspense } from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { describe, expect, test } from 'vitest'

import config from '../config-default'
import { TamaguiProvider, Text, View, createTamagui, getSplitStyles } from '../web/src'

/**
 * Program blocks under streaming SSR.
 *
 * The program block encoding says a block "inserts atomically: printed
 * contiguously in SSR output", and that any interleaving of streaming chunks is
 * safe. Contiguity in the *joined* document is not the same claim: a block split
 * across two chunks still joins back together, so a test that asserts against
 * `chunks.join('')` cannot see the difference. What matters to a browser is that
 * a block is never delivered in pieces, because a half-applied program is a
 * visibly wrong style until the rest of it arrives.
 *
 * So this checks the chunks themselves. The detector is exercised against a
 * synthetic split first — a check for a thing that never happens is worth
 * nothing unless it can be shown to notice when it does.
 */

const split = (props: Record<string, any>) =>
  getSplitStyles(
    props,
    Text.staticConfig,
    undefined as any,
    'light',
    { unmounted: false } as any,
    {
      isAnimated: false,
      noClass: false,
      resolveValues: 'auto',
    } as any
  )

const rulesFor = (result: any, identifier: string): string[] =>
  result.rulesToInsert[identifier]?.[4] ?? []

/**
 * How many chunks a block is spread over: 1 is whole, 0 is absent, and anything
 * above 1 means a browser saw part of the program before the rest.
 */
function chunksSpanned(chunks: string[], block: string): number {
  if (chunks.some((chunk) => chunk.includes(block))) return 1
  // not whole anywhere, so find the longest prefix that ends a chunk and check
  // whether the remainder starts the next one
  for (let i = 0; i < chunks.length - 1; i++) {
    for (let cut = 1; cut < block.length; cut++) {
      if (!chunks[i].endsWith(block.slice(0, cut))) continue
      if (
        chunks
          .slice(i + 1)
          .join('')
          .startsWith(block.slice(cut))
      )
        return 2
    }
  }
  return 0
}

async function streamWithSuspense(shellProps: object, lateProps: object) {
  const streamConfig = createTamagui(config.getDefaultTamaguiConfig() as any)
  let ready = false
  let release!: () => void
  const waiting = new Promise<void>((resolve) => {
    release = resolve
  })

  function Late() {
    if (!ready) throw waiting
    return <Text data-testid="late" {...lateProps} />
  }

  const chunks: string[] = []
  await new Promise<void>((resolve, reject) => {
    const output = new PassThrough()
    output.on('data', (chunk) => chunks.push(chunk.toString()))
    output.on('end', () => resolve())
    output.on('error', reject)

    const stream = renderToPipeableStream(
      <TamaguiProvider config={streamConfig} defaultTheme="light" disableInjectCSS>
        <Text data-testid="shell" {...shellProps} />
        <Suspense fallback={<div data-testid="fallback" />}>
          <Late />
        </Suspense>
      </TamaguiProvider>,
      {
        onShellReady() {
          stream.pipe(output)
          ready = true
          release()
        },
        onShellError: reject,
        onError: reject,
      }
    )
  })
  return chunks
}

describe('the split detector', () => {
  const block = '._c-1{color:red}._c-1:where(:hover){color:blue}'

  test('reports one chunk when a block arrives whole', () => {
    expect(chunksSpanned(['<div>', `<style>${block}</style>`, '</div>'], block)).toBe(1)
  })

  test('reports two when a block is cut across a chunk boundary', () => {
    const cut = block.indexOf('}') + 1
    expect(
      chunksSpanned(
        [`<style>${block.slice(0, cut)}`, `${block.slice(cut)}</style>`],
        block
      )
    ).toBe(2)
  })

  test('reports none when the block never arrives', () => {
    expect(chunksSpanned(['<div></div>'], block)).toBe(0)
  })
})

describe('program blocks over a stream', () => {
  // a program in the shell, a program only the suspended chunk introduces, and
  // one the two share, so duplicate arrival is covered as well as late arrival
  const shellProps = {
    backgroundColor: 'red hover:blue',
    color: 'rgb(1,2,3) hover:rgb(4,5,6)',
  }
  const lateProps = { color: 'rgb(1,2,3) hover:rgb(4,5,6)', opacity: '0.2 hover:0.8' }

  test('arrive whole, never split across a chunk boundary', async () => {
    const chunks = await streamWithSuspense(shellProps, lateProps)
    // if the shell and the suspended content came in one chunk there would be
    // no boundary to cross and the assertion below would prove nothing
    expect(chunks.length).toBeGreaterThan(1)

    const shellSplit = split(shellProps)
    const lateSplit = split(lateProps)
    const blocks = [
      [
        'shell backgroundColor',
        rulesFor(shellSplit, shellSplit.classNames.backgroundColor),
      ],
      ['shared color', rulesFor(shellSplit, shellSplit.classNames.color)],
      ['late opacity', rulesFor(lateSplit, lateSplit.classNames.opacity)],
    ] as const

    for (const [name, rules] of blocks) {
      expect(rules.length, name).toBeGreaterThan(1)
      expect(chunksSpanned(chunks, rules.join('\n')), name).toBe(1)
    }
  })

  test('emit a program shared by the shell and the late chunk exactly once', async () => {
    const chunks = await streamWithSuspense(shellProps, lateProps)
    const shellSplit = split(shellProps)
    const shared = rulesFor(shellSplit, shellSplit.classNames.color).join('\n')
    const document = chunks.join('')
    expect(document.split(shared).length - 1).toBe(1)
  })

  test('keep clause order inside the block, which is what the cascade reads', async () => {
    const chunks = await streamWithSuspense(shellProps, lateProps)
    const shellSplit = split(shellProps)
    const rules = rulesFor(shellSplit, shellSplit.classNames.backgroundColor)
    const carrier = chunks.find((chunk) => chunk.includes(rules.join('\n')))
    expect(carrier).toBeTruthy()
    // the base clause has to precede the hover clause: with equal specificity
    // the last matching rule wins, so reordering them inverts the program
    const base = carrier!.indexOf(rules[0])
    const hover = carrier!.indexOf(rules[rules.length - 1])
    expect(base).toBeGreaterThanOrEqual(0)
    expect(hover).toBeGreaterThan(base)
  })
})
