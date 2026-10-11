export function parseNativeTransform(raw: string): any[] | null {
  const out: any[] = []
  const pattern = /([A-Za-z][\w]*)\(([^()]*)\)/g
  let end = 0
  let match: RegExpExecArray | null
  while ((match = pattern.exec(raw))) {
    if (raw.slice(end, match.index).trim().replace(/^,/, '').trim()) return null
    end = pattern.lastIndex
    const name = match[1]
    const values = match[2].split(/\s*,\s*|\s+/).filter(Boolean)
    if (!values.length) return null
    const converted: (string | number)[] = []
    for (const value of values) {
      converted.push(
        /^-?(?:\d+\.?\d*|\.\d+)(?:px|dp)$/i.test(value)
          ? Number.parseFloat(value)
          : /^-?(?:\d+\.?\d*|\.\d+)$/.test(value)
            ? Number(value)
            : value
      )
    }
    if (name === 'translate' && converted.length > 1) {
      out.push({ translateX: converted[0] }, { translateY: converted[1] })
    } else if (
      name === 'scale' &&
      converted.length > 1 &&
      converted[0] !== converted[1]
    ) {
      out.push({ scaleX: converted[0] }, { scaleY: converted[1] })
    } else {
      out.push({ [name]: converted[0] })
    }
  }
  return end && !raw.slice(end).trim() ? out : null
}
