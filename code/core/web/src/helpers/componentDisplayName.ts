export const componentDisplayName = /* @__PURE__ */ Symbol.for(
  'tamagui.componentDisplayName'
)

export function setComponentDisplayName<T extends { displayName?: string }>(
  component: T,
  displayName?: string
) {
  if (displayName) {
    component.displayName = displayName
    ;(component as any)[componentDisplayName] = displayName
  }
  return component
}
