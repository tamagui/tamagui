import React from 'react'

// Utility for token replacement
function replaceToken(token: string): string {
  const tokenReplacements = {
    $color10: '',
    $1: 10,
    $2: 15,
    $3: 20,
    $4: 125,
    $5: 30,
    $6: 35,
    $7: 40,
    $8: 45,
    $9: 50,
    $10: 55,
    $11: 60,
    $12: 65,
    $13: 70,
    $14: 75,
    $15: 80,
    $16: 85,
    $17: 90,
    $18: 95,
    $19: 100,
    $20: 105,
    '$-1': -10,
    '$-2': -15,
    '$-3': -20,
    '$-4': -25,
    '$-5': -30,
    '$-6': -35,
    '$-7': -40,
    '$-8': -45,
    '$-9': -50,
    '$-10': -55,
    '$-11': -60,
    '$-12': -65,
    '$-13': -70,
    '$-14': -75,
    '$-15': -80,
    '$-16': -85,
    '$-17': -90,
    '$-18': -95,
    '$-19': -100,
    '$-20': -105,
  }
  return tokenReplacements[token] || token
}
function processPropsAndChildren(props: any): any {
  const processedProps = {}

  for (const [key, value] of Object.entries(props)) {
    if (typeof value === 'string' && value.startsWith('$')) {
      processedProps[key] = replaceToken(value)
    } else if (key === 'children' && React.isValidElement(value)) {
      // Recursively process children if it's a valid React element
      processedProps[key] = React.Children.toArray(value).map((child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, processPropsAndChildren(child.props))
        }
        return child
      })
      // } else if (typeof value === 'object' && value !== null) {
      // processedProps[key] = processPropsAndChildren(value) // Recurse into objects
    } else {
      processedProps[key] = value
    }
  }

  return processedProps
}

function cloneAndProcessTree(element: React.ReactElement) {
  function cloneElementWithProcessedProps(
    element: React.ReactElement
  ): React.ReactElement {
    if (!React.isValidElement(element)) {
      return element
    }
    const processedProps = processPropsAndChildren(
      element.props as { [key: string]: any }
    )
    // @ts-ignore
    const children = React.Children.toArray(element.props.children).map((child) =>
      // @ts-ignore
      cloneElementWithProcessedProps(child)
    )
    return React.cloneElement(element, processedProps, ...children)
  }

  return cloneElementWithProcessedProps(element)
}

function withTokenReplacement(WrappedComponent: React.ComponentType<any>) {
  return (props: any) => {
    // @ts-ignore
    const ProcessedElement = cloneAndProcessTree(WrappedComponent(props))
    return ProcessedElement
  }
}

export default withTokenReplacement
