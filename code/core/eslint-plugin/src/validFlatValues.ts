import {
  extractStyleSitesFromEstree,
  type EstreeStyleSite,
} from '@tamagui/language-service/extract-estree'
import {
  canonicalizeStyleValue,
  createCandidatePropertyVocabulary,
  createModifierRegistry,
  createStylePropSet,
  diagnoseStyleValueProgram,
  type GrammarConfigView,
} from '@tamagui/style-grammar/tooling'
import type { Rule } from 'eslint'

type RuleOption = {
  config: GrammarConfigView
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
    const styleProps = createStylePropSet(config)
    const sourceCode = context.sourceCode

    const report = (site: EstreeStyleSite): void => {
      const node = site.node as Rule.Node
      const diagnostics = diagnoseStyleValueProgram(site.property, site.value, {
        config,
        registry,
        candidates,
      })
      for (const diagnostic of diagnostics) {
        context.report({
          node,
          // the engine reports value-relative spans; surface them exactly
          loc: {
            start: sourceCode.getLocFromIndex(site.start + diagnostic.start),
            end: sourceCode.getLocFromIndex(site.start + diagnostic.end),
          },
          messageId: 'invalidFlatValue',
          data: { message: diagnostic.message },
        })
      }
      if (diagnostics.length > 0) return

      const formatted = canonicalizeStyleValue(site.value, registry)
      if (!formatted.ok || formatted.value === site.value) return
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

    return {
      'Program:exit'(program) {
        const sites = extractStyleSitesFromEstree(program, {
          isStyleProp: (name) => styleProps.has(name),
        })
        for (const site of sites) report(site)
      },
    }
  },
}
