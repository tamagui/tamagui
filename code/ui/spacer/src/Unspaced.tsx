// for elements to avoid spacing
export function Unspaced(props: { children?: any }) {
  return props.children
}

Unspaced['isUnspaced'] = true

export function isUnspaced(child: React.ReactNode) {
  const t = child?.['type']
  return t?.['isVisuallyHidden'] || t?.['isUnspaced']
}
