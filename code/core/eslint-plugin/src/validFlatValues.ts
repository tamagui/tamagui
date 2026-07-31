import {
  canonicalizeStyleValue,
  createCandidatePropertyVocabulary,
  createModifierRegistry,
  diagnoseStyleValue,
  grammarEntries,
  type GrammarConfigView,
} from '@tamagui/style-grammar'
import type { Rule } from 'eslint'

type RuleOption = {
  config: GrammarConfigView
}

type LiteralNode = Rule.Node & {
  type: 'Literal'
  value: unknown
}

type TemplateLiteralNode = Rule.Node & {
  type: 'TemplateLiteral'
  expressions: Rule.Node[]
  quasis: Array<{ value: { cooked?: string | null } }>
}

type ObjectExpressionNode = Rule.Node & {
  type: 'ObjectExpression'
  properties: Rule.Node[]
}

type PropertyNode = Rule.Node & {
  type: 'Property'
  computed: boolean
  key: Rule.Node & { name?: string; value?: unknown }
  value: Rule.Node
}

function staticString(node: Rule.Node | null | undefined): string | null {
  if (!node) return null
  if (node.type === 'Literal') {
    const value = (node as LiteralNode).value
    return typeof value === 'string' ? value : null
  }
  if (node.type !== 'TemplateLiteral') return null
  const template = node as TemplateLiteralNode
  if (template.expressions.length !== 0) return null
  return template.quasis[0]?.value.cooked ?? null
}

function propertyName(node: PropertyNode): string | null {
  if (node.computed) return null
  if (node.key.type === 'Identifier') return node.key.name || null
  return typeof node.key.value === 'string' ? node.key.value : null
}

function jsxRootName(node: Rule.Node & { name?: Rule.Node }): string | null {
  let name = node.name
  while (name?.type === 'JSXMemberExpression') {
    name = (name as Rule.Node & { object: Rule.Node }).object
  }
  return name?.type === 'JSXIdentifier'
    ? (name as Rule.Node & { name: string }).name
    : null
}

function importedName(node: Rule.Node): string | null {
  if (node.type !== 'ImportSpecifier') return null
  const imported = (
    node as Rule.Node & { imported: Rule.Node & { name?: string; value?: unknown } }
  ).imported
  if (imported.type === 'Identifier') return imported.name || null
  return typeof imported.value === 'string' ? imported.value : null
}

export const validFlatValues: Rule.RuleModule = {
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description: 'validate static Tamagui flat values with @tamagui/style-grammar',
    },
    schema: [
      {
        type: 'object',
        properties: {
          config: {
            type: 'object',
          },
        },
        required: ['config'],
        additionalProperties: false,
      },
    ],
    messages: {
      invalidFlatValue: '{{message}}',
      nonCanonicalFlatValue: 'use the canonical flat value "{{canonical}}"',
    },
  },

  create(context) {
    const option = context.options[0] as RuleOption | undefined
    const config = option?.config || {}
    const registry = createModifierRegistry(config).registry
    const candidates = createCandidatePropertyVocabulary(config)
    const styleProps = new Set(grammarEntries.map((entry) => entry.prop))
    for (const shorthand in config.shorthands) {
      styleProps.add(shorthand)
      styleProps.add(config.shorthands[shorthand])
    }

    const tamaguiComponents = new Set<string>()
    const styledBindings = new Set<string>()
    const styledComponents = new Set<string>()

    const report = (node: Rule.Node, property: string, value: string): void => {
      if (!styleProps.has(property)) return
      const diagnostics = diagnoseStyleValue(property, value, {
        config,
        registry,
        candidates,
      })
      for (const diagnostic of diagnostics) {
        context.report({
          node,
          messageId: 'invalidFlatValue',
          data: { message: diagnostic.message },
        })
      }
      if (diagnostics.length > 0) return

      const formatted = canonicalizeStyleValue(value, registry)
      if (!formatted.ok || formatted.value === value) return
      const canonical = formatted.value
      context.report({
        node,
        messageId: 'nonCanonicalFlatValue',
        data: { canonical },
        fix(fixer) {
          return fixer.replaceText(node, JSON.stringify(canonical))
        },
      })
    }

    const visitStyleObject = (object: ObjectExpressionNode): void => {
      for (const member of object.properties) {
        if (member.type !== 'Property') continue
        const property = member as PropertyNode
        const name = propertyName(property)
        if (name && styleProps.has(name)) {
          const value = staticString(property.value)
          if (value !== null) report(property.value, name, value)
          continue
        }
        if (property.value.type === 'ObjectExpression') {
          visitStyleObject(property.value as ObjectExpressionNode)
        } else if (property.value.type === 'ArrayExpression') {
          const elements = (
            property.value as Rule.Node & { elements: Array<Rule.Node | null> }
          ).elements
          for (const element of elements) {
            if (element?.type === 'ObjectExpression') {
              visitStyleObject(element as ObjectExpressionNode)
            }
          }
        }
      }
    }

    return {
      ImportDeclaration(node) {
        const source = (node as Rule.Node & { source: LiteralNode }).source.value
        if (
          typeof source !== 'string' ||
          (source !== 'tamagui' && !source.startsWith('@tamagui/'))
        ) {
          return
        }
        const specifiers = (
          node as Rule.Node & {
            specifiers: Array<Rule.Node & { local: { name: string } }>
          }
        ).specifiers
        for (const specifier of specifiers) {
          const local = specifier.local.name
          const imported = importedName(specifier)
          if (imported === 'styled') {
            styledBindings.add(local)
          } else if (
            specifier.type === 'ImportNamespaceSpecifier' ||
            (imported && /^[A-Z]/.test(imported))
          ) {
            tamaguiComponents.add(local)
          }
        }
      },

      VariableDeclarator(node) {
        const declarator = node as Rule.Node & {
          id: Rule.Node & { name?: string }
          init?: Rule.Node & { callee?: Rule.Node & { name?: string } }
        }
        if (
          declarator.id.type === 'Identifier' &&
          declarator.init?.type === 'CallExpression' &&
          declarator.init.callee?.type === 'Identifier' &&
          declarator.init.callee.name &&
          styledBindings.has(declarator.init.callee.name)
        ) {
          styledComponents.add(declarator.id.name!)
        }
      },

      CallExpression(node) {
        const call = node as Rule.Node & {
          callee: Rule.Node & { name?: string }
          arguments: Rule.Node[]
        }
        if (
          call.callee.type !== 'Identifier' ||
          !call.callee.name ||
          !styledBindings.has(call.callee.name)
        ) {
          return
        }
        const configNode = call.arguments[1]
        if (configNode?.type === 'ObjectExpression') {
          visitStyleObject(configNode as ObjectExpressionNode)
        }
      },

      JSXOpeningElement(node) {
        const opening = node as Rule.Node & {
          name: Rule.Node
          attributes: Rule.Node[]
        }
        const root = jsxRootName(opening)
        if (!root || (!tamaguiComponents.has(root) && !styledComponents.has(root))) {
          return
        }
        for (const attributeNode of opening.attributes) {
          if (attributeNode.type !== 'JSXAttribute') continue
          const attribute = attributeNode as Rule.Node & {
            name: Rule.Node & { name?: string }
            value?: Rule.Node & { expression?: Rule.Node }
          }
          const name =
            attribute.name.type === 'JSXIdentifier' ? attribute.name.name : null
          if (!name || !styleProps.has(name)) continue
          const valueNode =
            attribute.value?.type === 'JSXExpressionContainer'
              ? attribute.value.expression
              : attribute.value
          const value = staticString(valueNode)
          if (value !== null && valueNode) report(valueNode, name, value)
        }
      },
    }
  },
}
