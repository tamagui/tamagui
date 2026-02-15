import { tokenCategories } from '@tamagui/helpers'
import { getConfig } from '../config'
import { isVariable } from '../createVariable'
import type {
  GetStyleState,
  ResolveVariableAs,
  SplitStyleProps,
  Variable,
} from '../types'
import { getFontsForLanguage } from './getVariantExtras'

const fontShorthand = {
  fontSize: 'size',
  fontWeight: 'weight',
}

let didLogMissingToken = false

// mutable state for font family tracking across propMapper
let _lastFontFamilyToken: any = null

export function getLastFontFamilyToken() {
  return _lastFontFamilyToken
}

export function setLastFontFamilyToken(value: any) {
  _lastFontFamilyToken = value
}

export const getTokenForKey = (
  key: string,
  value: string,
  styleProps: SplitStyleProps,
  styleState: Partial<GetStyleState>
) => {
  let resolveAs = styleProps.resolveValues || 'none'

  if (resolveAs === 'none') {
    return value
  }

  const { theme, conf = getConfig(), context, fontFamily, staticConfig } = styleState

  const themeValue = theme ? theme[value] || theme[value.slice(1)] : undefined

  const tokensParsed = conf.tokensParsed
  let valOrVar: any
  let hasSet = false

  const customTokenAccept = staticConfig?.accept?.[key]
  if (customTokenAccept) {
    const val = themeValue ?? tokensParsed[customTokenAccept]?.[value]
    if (val != null) {
      resolveAs = 'value' // always resolve custom tokens as values
      valOrVar = val
      hasSet = true
    }
  }

  if (themeValue) {
    if (resolveAs === 'except-theme') {
      return value
    }

    valOrVar = themeValue
    if (process.env.NODE_ENV === 'development' && styleState.debug === 'verbose') {
      globalThis.tamaguiAvoidTracking = true
      console.info(
        ` - resolving ${key} to theme value ${value} resolveAs ${resolveAs}`,
        valOrVar
      )
      globalThis.tamaguiAvoidTracking = false
    }
    hasSet = true
  } else {
    if (value in conf.specificTokens) {
      hasSet = true
      valOrVar = conf.specificTokens[value]
    } else {
      switch (key) {
        case 'fontFamily': {
          const fontsParsed = context?.language
            ? getFontsForLanguage(conf.fontsParsed, context.language)
            : conf.fontsParsed
          valOrVar = fontsParsed[value]?.family || value
          setLastFontFamilyToken(value)
          hasSet = true
          break
        }
        case 'fontSize':
        case 'lineHeight':
        case 'letterSpacing':
        case 'fontWeight': {
          const fam = fontFamily || conf.defaultFontToken
          if (fam) {
            const fontsParsed = context?.language
              ? getFontsForLanguage(conf.fontsParsed, context.language)
              : conf.fontsParsed
            const font = fontsParsed[fam] || fontsParsed[conf.defaultFontToken]
            valOrVar = font?.[fontShorthand[key] || key]?.[value] || value
            hasSet = true
          }
          break
        }
      }
      for (const cat in tokenCategories) {
        if (key in tokenCategories[cat]) {
          const res = tokensParsed[cat]?.[value]

          if (res != null) {
            valOrVar = res
            hasSet = true
          } else {
            if (process.env.NODE_ENV === 'development') {
              if (process.env.TAMAGUI_DISABLE_MISSING_TOKEN_LOG !== '1') {
                if (!didLogMissingToken) {
                  didLogMissingToken = true
                  console.groupCollapsed(
                    `[tamagui] Warning: missing token ${key} in category ${cat} - ${value} (open for details)`
                  )
                  console.info(
                    `Note: this could just be due to you not setting all the theme tokens Tamagui expects, which is harmless, but
                    it also often can be because you have a duplicated Tamagui in your bundle, which can cause tricky bugs.`
                  )
                  console.info(
                    `To see if you have duplicated dependencies, in Chrome DevTools hit CMD+P and type TamaguiProvider.
                    If you see both a .cjs and a .mjs entry, it's duplicated.`
                  )
                  console.info(
                    `You can debug that issue by opening the .mjs and .cjs files and setting a breakpoint at the top of each.`
                  )
                  console.info(
                    `We only log this warning one time as it's sometimes harmless, to disable this log entirely set process.env.TAMAGUI_DISABLE_MISSING_TOKEN_LOG=1.`
                  )
                  console.groupEnd()
                }
              }
            }
          }
        }
      }
    }

    if (!hasSet) {
      const spaceVar = tokensParsed.space[value]
      if (spaceVar != null) {
        valOrVar = spaceVar
        hasSet = true
      }
    }
  }

  if (hasSet) {
    const out = resolveVariableValue(key, valOrVar, resolveAs)
    if (process.env.NODE_ENV === 'development' && styleState.debug === 'verbose') {
      globalThis.tamaguiAvoidTracking = true
      console.info(`resolved`, resolveAs, valOrVar, out)
      globalThis.tamaguiAvoidTracking = false
    }
    return out
  }

  // they didn't define this token don't return anything, we could warn?

  if (process.env.NODE_ENV === 'development' && styleState.debug === 'verbose') {
    console.warn(`Warning: no token found for ${key}, omitting`)
  }
}

export function resolveVariableValue(
  key: string,
  valOrVar: Variable | any,
  resolveValues?: ResolveVariableAs
) {
  if (resolveValues === 'none') {
    return valOrVar
  }
  if (isVariable(valOrVar)) {
    if (resolveValues === 'value') {
      return valOrVar.val
    }

    // @ts-expect-error this is fine until we can type better
    const get = valOrVar?.get

    // shadowColor doesn't support dynamic style
    if (process.env.TAMAGUI_TARGET !== 'native' || key !== 'shadowColor') {
      if (typeof get === 'function') {
        const resolveDynamicFor = resolveValues === 'web' ? 'web' : undefined
        return get(resolveDynamicFor)
      }
    }

    return process.env.TAMAGUI_TARGET === 'native' ? valOrVar.val : valOrVar.variable
  }
  return valOrVar
}
