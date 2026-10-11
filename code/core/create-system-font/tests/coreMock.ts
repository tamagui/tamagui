export const getVariableValue = (value: any): any => value?.val ?? value

export const createFont = (font: any): any => {
  const sizeKeys = Object.keys(font.size || {})

  return Object.freeze(
    Object.fromEntries(
      Object.entries(font).map(([key, section]) => {
        if (typeof section === 'string') {
          return [key, section]
        }

        const entries = section as Record<string, any>
        const sectionKeys = Object.keys(entries)
        let value = entries[sectionKeys[0]]

        return [
          key,
          Object.fromEntries(
            [...new Set([...sizeKeys, ...sectionKeys])].map((sectionKey) => {
              value = entries[sectionKey] ?? value
              return [sectionKey, value]
            })
          ),
        ]
      })
    )
  )
}
