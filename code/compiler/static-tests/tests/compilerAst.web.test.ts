import {
  findAstNode,
  parseModuleAst,
  resolvedModuleId,
  yukuFactory,
  walkAst,
  type AstNode,
} from '@tamagui/compiler-core'
import { describe, expect, test } from 'vitest'

describe('compiler AST lookup', () => {
  test('returns the first match without decoding its children or later siblings', () => {
    const match: AstNode = {
      type: 'Identifier',
      start: 1,
      end: 2,
      get unused() {
        throw new Error('matched node children must stay unread')
      },
    }
    const root: AstNode = {
      type: 'Program',
      start: 0,
      end: 5,
      body: [match],
      get later() {
        throw new Error('later siblings must stay unread')
      },
    }
    expect(findAstNode(root, (node) => node.type === 'Identifier')).toBe(match)
  })

  test('does not decode ignored metadata while walking', () => {
    const root: AstNode = {
      type: 'Program',
      start: 0,
      end: 0,
      body: [],
      get comments() {
        throw new Error('ignored comments must stay unread')
      },
      get tokens() {
        throw new Error('ignored tokens must stay unread')
      },
    }
    const seen: AstNode[] = []
    walkAst(root, (node) => seen.push(node))
    expect(seen).toEqual([root])
  })

  test('preserves depth-first order and parent/key arguments', () => {
    const root = parseModuleAst('const first = 1; const second = 2')
    const seen: string[] = []
    const found = findAstNode(root, (node, parent, key) => {
      if (node.type !== 'Identifier') return false
      seen.push(String(node.name))
      expect(parent?.type).toBe('VariableDeclarator')
      expect(key).toBe('id')
      return node.name === 'second'
    })
    expect(found?.name).toBe('second')
    expect(seen).toEqual(['first', 'second'])
    expect(findAstNode(root, (node) => node.type === 'Missing')).toBeNull()
  })

  test('range-limited lookup agrees with full traversal for parsed TSX nodes', () => {
    const root = parseModuleAst(`
      // Unicode positions and shared spans between wrappers must stay exact.
      const title: string = 'π🙂'
      export const Component = (props: { gap: number }) => (
        <View gap={props.gap} {...{ opacity: 1 }}>
          {title}{[1, 2].map(n => <Text key={n}>{n}</Text>)}
        </View>
      )
      const asserted = ({ width: 4 } satisfies { width: number }) as const
    `)
    const firstBySpan = new Map<string, AstNode>()
    walkAst(root, (node) => {
      const key = `${node.start}:${node.end}`
      if (!firstBySpan.has(key)) firstBySpan.set(key, node)
    })
    for (const expected of firstBySpan.values()) {
      expect(
        findAstNode(
          root,
          (node) => node.start === expected.start && node.end === expected.end,
          expected
        )
      ).toBe(expected)
    }
  })

  test('uses the declaration parent for const, mutable, and non-variable symbols', () => {
    const id = resolvedModuleId('/test/definitions.tsx')
    const source = `
      export const fixed = 4, other = 8
      export let mutable = 3
      export var legacy = 2
      export function fn() { const fixed = 9; return fixed }
      export class Model {}
      export const { destructured } = { destructured: 1 }
    `
    const candidate = yukuFactory.create({
      files: new Map([[id, source]]),
      resolutions: new Map(),
    })
    candidate.link()
    for (const [name, constant, value] of [
      ['fixed', true, 4],
      ['other', true, 8],
      ['mutable', false, 3],
      ['legacy', false, 2],
      ['fn', false, undefined],
      ['Model', false, undefined],
      // Destructuring remains a bailout; do not assign the whole object's
      // initializer to a binding within that object pattern.
      ['destructured', false, undefined],
    ] as const) {
      const definition = candidate.definitionOf(id, name)
      expect(definition?.constant, name).toBe(constant)
      expect(definition?.initializer?.value, name).toBe(value)
    }
    const start = source.indexOf('return fixed') + 'return '.length
    const shadowed = candidate.definitionAt(id, start, start + 'fixed'.length)
    expect(shadowed?.constant).toBe(true)
    expect(shadowed?.initializer?.value).toBe(9)
  })
})
