// ssr only

export const AllRules = new Set<string>()

export const addRule = (rule: string) => {
  AllRules.add(rule)
}

export const getStyleRules = () => AllRules
