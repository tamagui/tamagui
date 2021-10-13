export function insertStyleRule(rule: string) {
  if (typeof window === 'undefined') {
    return
  }
  const sheet = window.document.styleSheets[0]
  if (!sheet) {
    return
  }
  sheet.insertRule(rule, sheet.cssRules.length)
}
