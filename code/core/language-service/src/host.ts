import type { HostView } from '@tamagui/style-grammar/tooling'
import type ts from 'typescript'

/**
 * resolves the style-prop surface TypeScript assigns to a Tamagui component.
 * the staticConfig marker distinguishes Tamagui hosts from unrelated React
 * components, while the call signatures retain styled component prop types.
 */
export function resolveTamaguiHost(
  checker: ts.TypeChecker,
  component: ts.Node
): HostView | undefined {
  const componentType = checker.getTypeAtLocation(component)
  if (!checker.getPropertyOfType(componentType, 'staticConfig')) return undefined

  const propsTypes: ts.Type[] = []
  for (const signature of componentType.getCallSignatures()) {
    const props = signature.getParameters()[0]
    if (props) propsTypes.push(checker.getTypeOfSymbolAtLocation(props, component))
  }
  if (propsTypes.length === 0) return undefined

  return {
    componentName: component.getText(),
    accepts: (property) =>
      propsTypes.some(
        (propsType) =>
          checker.getPropertyOfType(checker.getApparentType(propsType), property) !==
          undefined
      ),
  }
}
