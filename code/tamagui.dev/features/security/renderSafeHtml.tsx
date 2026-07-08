import { Fragment, createElement, type ReactNode } from 'react'
import parse from 'rehype-parse'
import { unified } from 'unified'

const ALLOWED_TAGS = new Set(['span', 'div', 'br'])
const SAFE_CLASS_NAME = /^[A-Za-z0-9_-]+$/
const SAFE_DATA_VALUE = /^[A-Za-z0-9_.:;,+\- ]{0,160}$/

export function renderSafeHtml(html: string) {
  const tree = unified().use(parse, { emitParseErrors: true, fragment: true }).parse(html)

  return renderSafeHastNodes(tree.children as any[])
}

export function renderSafeHastNodes(nodes: any[] = [], keyPrefix = 'safe-html') {
  return nodes.map((node, index) => renderSafeHastNode(node, `${keyPrefix}-${index}`))
}

function renderSafeHastNode(node: any, key: string): ReactNode {
  if (!node) {
    return null
  }

  if (node.type === 'text') {
    return node.value
  }

  if (node.type !== 'element') {
    return null
  }

  const children = renderSafeHastNodes(node.children, key)
  const tagName = String(node.tagName || '').toLowerCase()

  if (!ALLOWED_TAGS.has(tagName)) {
    return <Fragment key={key}>{children}</Fragment>
  }

  if (tagName === 'br') {
    return createElement('br', { key })
  }

  return createElement(tagName, getSafeProps(node.properties, key), children)
}

function getSafeProps(properties: Record<string, unknown> = {}, key: string) {
  const props: Record<string, unknown> = { key }
  const className = getSafeClassName(properties.className)

  if (className) {
    props.className = className
  }

  for (const [name, value] of Object.entries(properties)) {
    const dataName = getDataAttributeName(name)

    if (dataName && isSafeDataValue(value)) {
      props[dataName] = String(value)
    }
  }

  return props
}

function getSafeClassName(value: unknown) {
  const classes = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split(' ')
      : []
  const safeClasses = classes
    .map((className) => String(className).trim())
    .filter((className) => SAFE_CLASS_NAME.test(className))

  return safeClasses.length ? safeClasses.join(' ') : undefined
}

function getDataAttributeName(name: string) {
  if (name.startsWith('data-')) {
    return name
  }

  if (!/^data[A-Z]/.test(name)) {
    return null
  }

  return name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)
}

function isSafeDataValue(value: unknown) {
  if (
    typeof value !== 'string' &&
    typeof value !== 'number' &&
    typeof value !== 'boolean'
  ) {
    return false
  }

  return SAFE_DATA_VALUE.test(String(value))
}
