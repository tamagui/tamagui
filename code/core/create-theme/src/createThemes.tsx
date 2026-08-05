export type ThemeValue = string

export type ThemeTokens = {
  color: Record<string, ThemeValue>
}

export type ThemeRecipe = Record<string, unknown>

export type ThemeDefinitionContext<Parent extends ThemeRecipe = ThemeRecipe> = {
  parent: Parent
}

export type ThemeDefinitionObject = {
  values?: Record<string, ThemeValue>
  children?: ThemeChildren
  [key: string]: unknown
}

export type ThemeTreeDefinition<Parent extends ThemeRecipe = ThemeRecipe> =
  | ThemeDefinitionObject
  | ((context: ThemeDefinitionContext<Parent>) => ThemeDefinitionObject | null)

export type ThemeChildren = Record<string, ThemeTreeDefinition>

export type ThemeTree = {
  light: ThemeTreeDefinition
  dark: ThemeTreeDefinition
  children?: ThemeChildren
}

type ColorLiteral = `#${string}` | `rgb${string}` | `hsl${string}` | 'transparent'

type ThemeInputValue<Tokens extends ThemeTokens> =
  | Extract<keyof Tokens['color'], string>
  | ColorLiteral

type ResolvedDefinition<Definition> = Definition extends (...args: any[]) => infer Result
  ? Exclude<Result, null>
  : Definition

type DefinitionChildren<Definition> =
  ResolvedDefinition<Definition> extends {
    children?: infer Children
  }
    ? Children
    : never

type ChildThemeNames<Parent extends string, Children> =
  Children extends Record<string, unknown>
    ? {
        [Name in Extract<keyof Children, string>]:
          | `${Parent}_${Name}`
          | ChildThemeNames<`${Parent}_${Name}`, DefinitionChildren<Children[Name]>>
      }[Extract<keyof Children, string>]
    : never

export type ThemeNames<Tree extends ThemeTree> =
  | 'light'
  | 'dark'
  | ChildThemeNames<'light', Tree['children']>
  | ChildThemeNames<'dark', Tree['children']>
  | ChildThemeNames<'light', DefinitionChildren<Tree['light']>>
  | ChildThemeNames<'dark', DefinitionChildren<Tree['dark']>>

type RecipeFields<Definition> = Omit<
  ResolvedDefinition<Definition>,
  'children' | 'values'
>

type ChildDefinitions<
  Children,
  Depth extends readonly unknown[],
> = Depth extends readonly [unknown, ...infer Rest]
  ? Children extends Record<string, unknown>
    ? Children[keyof Children] | DefinitionsWithin<Children[keyof Children], Rest>
    : never
  : never

type DefinitionsWithin<Definition, Depth extends readonly unknown[]> =
  | Definition
  | ChildDefinitions<DefinitionChildren<Definition>, Depth>

type DefinitionsInTree<Tree extends ThemeTree> =
  | DefinitionsWithin<Tree['light'], [1, 1, 1, 1, 1, 1]>
  | DefinitionsWithin<Tree['dark'], [1, 1, 1, 1, 1, 1]>
  | ChildDefinitions<Tree['children'], [1, 1, 1, 1, 1, 1]>

type KeysOfUnion<Union> = Union extends Union ? keyof Union : never

type ValueOfUnion<Union, Key extends PropertyKey> = Union extends Union
  ? Key extends keyof Union
    ? Union[Key]
    : never
  : never

type MergeRecipeUnion<Union> = {
  [Key in KeysOfUnion<Union>]: ValueOfUnion<Union, Key>
}

type RootRecipe<Tree extends ThemeTree> =
  | RecipeFields<Tree['light']>
  | RecipeFields<Tree['dark']>

type RecipeForTree<Tree extends ThemeTree> = {
  [Key in keyof RootRecipe<Tree>]: ValueOfUnion<RootRecipe<Tree>, Key>
} & Partial<MergeRecipeUnion<RecipeFields<DefinitionsInTree<Tree>>>>

export type GetThemeContext<
  Tokens extends ThemeTokens = ThemeTokens,
  Recipe extends ThemeRecipe = ThemeRecipe,
> = {
  recipe: Recipe
  name: string
  tokens: Tokens
}

type InvalidValueKeys<Values, Theme> = Exclude<keyof Values, keyof Theme>

type ValidatedValues<Values, Theme, Tokens extends ThemeTokens> =
  Values extends Record<string, unknown>
    ? Values & {
        [Key in InvalidValueKeys<Values, Theme>]: never
      } & {
        [Key in keyof Values]: Values[Key] extends ThemeInputValue<Tokens>
          ? Values[Key]
          : never
      }
    : never

type ValidatedChildren<Children, Theme, Tokens extends ThemeTokens> =
  Children extends Record<string, unknown>
    ? {
        [Name in keyof Children]: ValidatedDefinition<Children[Name], Theme, Tokens>
      }
    : never

type ValidatedDefinition<
  Definition,
  Theme,
  Tokens extends ThemeTokens,
> = Definition extends (...args: infer Args) => infer Result
  ? (
      ...args: Args
    ) => Result extends null ? null : ValidatedDefinitionObject<Result, Theme, Tokens>
  : ValidatedDefinitionObject<Definition, Theme, Tokens>

type ValidatedDefinitionObject<Definition, Theme, Tokens extends ThemeTokens> =
  Definition extends Record<string, unknown>
    ? Definition &
        ('values' extends keyof Definition
          ? {
              values: ValidatedValues<Definition['values'], Theme, Tokens>
            }
          : unknown) &
        ('children' extends keyof Definition
          ? {
              children: ValidatedChildren<Definition['children'], Theme, Tokens>
            }
          : unknown)
    : never

type ValidatedTree<Tree extends ThemeTree, Theme, Tokens extends ThemeTokens> = Tree & {
  light: ValidatedDefinition<Tree['light'], Theme, Tokens>
  dark: ValidatedDefinition<Tree['dark'], Theme, Tokens>
  children?: ValidatedChildren<Tree['children'], Theme, Tokens>
}

type ValuesInDefinition<Definition> =
  ResolvedDefinition<Definition> extends {
    values?: infer Values
  }
    ? Values
    : never

type ValueDefinitionsWithin<Definition, Depth extends readonly unknown[]> =
  | ValuesInDefinition<Definition>
  | (Depth extends readonly [unknown, ...infer Rest]
      ? DefinitionChildren<Definition> extends infer Children
        ? Children extends Record<string, unknown>
          ? ValueDefinitionsWithin<Children[keyof Children], Rest>
          : never
        : never
      : never)

type ExplicitTheme<Tree extends ThemeTree> = MergeRecipeUnion<
  | ValueDefinitionsWithin<Tree['light'], [1, 1, 1, 1, 1, 1]>
  | ValueDefinitionsWithin<Tree['dark'], [1, 1, 1, 1, 1, 1]>
  | (Tree['children'] extends infer Children
      ? Children extends Record<string, unknown>
        ? ValueDefinitionsWithin<Children[keyof Children], [1, 1, 1, 1, 1, 1]>
        : never
      : never)
>

export type CreatedThemes<Names extends string, Theme extends Record<string, string>> = {
  [Name in Names]: { [Key in keyof Theme]: string }
}

export function createThemes<
  const Tokens extends ThemeTokens,
  const Tree extends ThemeTree,
  const Theme extends Record<string, ThemeInputValue<Tokens>>,
>(
  tokens: Tokens,
  tree: ValidatedTree<Tree, Theme, Tokens>,
  options: {
    getTheme: (context: GetThemeContext<Tokens, RecipeForTree<Tree>>) => Theme
  }
): CreatedThemes<ThemeNames<Tree>, Theme>

export function createThemes<
  const Tokens extends ThemeTokens,
  const Tree extends ThemeTree,
>(
  tokens: Tokens,
  tree: ValidatedTree<Tree, Record<string, string>, Tokens>,
  options?: { getTheme?: undefined }
): CreatedThemes<ThemeNames<Tree>, ExplicitTheme<Tree>>

export function createThemes(
  tokens: ThemeTokens,
  tree: ThemeTree,
  options?: {
    getTheme?: (context: GetThemeContext) => Record<string, string>
  }
): Record<string, Record<string, string>> {
  const rootKeys = Object.keys(tree).filter((key) => key !== 'children')
  if (
    rootKeys.length !== 2 ||
    !Object.prototype.hasOwnProperty.call(tree, 'light') ||
    !Object.prototype.hasOwnProperty.call(tree, 'dark')
  ) {
    throw new Error('createThemes tree must have exactly the roots "light" and "dark"')
  }

  const themes: Record<string, Record<string, string>> = {}
  const deduped = new Map<string, Record<string, string>>()

  const add = (
    name: string,
    definition: ThemeTreeDefinition,
    parent: ThemeRecipe,
    inheritedChildren?: ThemeChildren
  ): void => {
    const resolvedDefinition =
      typeof definition === 'function' ? definition({ parent }) : definition
    if (resolvedDefinition === null) return

    const { values, children, ...recipeFields } = resolvedDefinition
    const recipe = { ...parent, ...recipeFields }
    const unresolved = {
      ...options?.getTheme?.({ recipe, name, tokens }),
      ...values,
    }
    const resolved: Record<string, string> = {}

    for (const key in unresolved) {
      const value = unresolved[key]
      const token = tokens.color[value]
      if (token !== undefined) {
        resolved[key] = token
        continue
      }

      const isColor =
        value === 'transparent' ||
        /^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i.test(value) ||
        /^(?:rgb|rgba|hsl|hsla)\(\s*[^)]+\)$/i.test(value)
      if (isColor) {
        resolved[key] = value
        continue
      }

      let nearest = ''
      let nearestDistance = Number.POSITIVE_INFINITY
      for (const tokenName in tokens.color) {
        const previous = Array.from({ length: tokenName.length + 1 }, (_, index) => index)
        for (let valueIndex = 0; valueIndex < value.length; valueIndex++) {
          let diagonal = previous[0]!
          previous[0] = valueIndex + 1
          for (let tokenIndex = 0; tokenIndex < tokenName.length; tokenIndex++) {
            const above = previous[tokenIndex + 1]!
            previous[tokenIndex + 1] = Math.min(
              previous[tokenIndex]! + 1,
              above + 1,
              diagonal + (value[valueIndex] === tokenName[tokenIndex] ? 0 : 1)
            )
            diagonal = above
          }
        }
        const distance = previous[tokenName.length]!
        if (distance < nearestDistance) {
          nearest = tokenName
          nearestDistance = distance
        }
      }

      throw new Error(
        `Invalid color value "${value}" for theme "${name}" key "${key}".${nearest ? ` Did you mean token "${nearest}"?` : ''}`
      )
    }

    const identity = JSON.stringify(
      Object.keys(resolved)
        .sort()
        .map((key) => [key, resolved[key]])
    )
    themes[name] = deduped.get(identity) || resolved
    deduped.set(identity, themes[name]!)

    const childSets = [inheritedChildren, children]
    for (const childSet of childSets) {
      if (!childSet) continue
      for (const childName in childSet) {
        const fullName = `${name}_${childName}`
        if (Object.prototype.hasOwnProperty.call(themes, fullName)) {
          throw new Error(`Duplicate generated theme name "${fullName}"`)
        }
        add(fullName, childSet[childName]!, recipe)
      }
    }
  }

  add('light', tree.light, {}, tree.children)
  add('dark', tree.dark, {}, tree.children)

  return themes
}
