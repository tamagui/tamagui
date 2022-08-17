import React from 'react'

export function Heading({
  linkText,
  url,
  children,
}: {
  linkText?: string
  url?: string
  children: string
}) {
  return (
    <span style={{ display: 'flex', alignItems: 'baseline', padding: '0 0 0em' }}>
      <span style={{ paddingRight: '0em', flex: 1, fontWeight: 'bold' }}>{children} </span>
      <a
        style={{
          color: 'blue',
          fontFamily: 'monospace',
          textDecoration: 'underline',
        }}
        href={url}
      >
        {linkText}
      </a>
    </span>
  )
}
