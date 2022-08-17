import React from 'react'

import { Heading } from './Heading.js'

interface Navigation {
  url: string
  type: string
  ttfb: number
  fcp: number
  lcp: number
  duration: number
  size: number
}

interface Props {
  navigations: Navigation[]
}

export function Performance({ navigations }: Props) {
  const navigationsMarkup = navigations.map(
    ({ url, ttfb, fcp, size, duration, type }: Navigation) => (
      <li key={url} style={{ padding: '0.5em 0', borderBottom: '1px solid' }}>
        <Item label={type} value={url.replace('http://localhost:3000', '')} />
        <div style={{ display: 'flex' }}>
          <Item label="TTFB" value={ttfb} />
          <Item label="Duration" value={duration} />
          <Item label="FCP" value={fcp} />
        </div>
      </li>
    )
  )
  return (
    <>
      <Heading>Performance</Heading>
      <ul>{navigationsMarkup}</ul>
    </>
  )
}

const Item = ({ label, value, unit }: PillProps) => {
  if (!value) {
    return null
  }

  const val =
    typeof value === 'string' ? (
      <span style={{ fontWeight: 'bold' }}>{value}</span>
    ) : (
      `${Math.round(value)}${unit || 'ms'}`
    )

  return (
    <span
      style={{
        fontFamily: 'monospace',
        padding: '0 2em 0 0',
      }}
    >
      {label && label.padEnd(10)}
      {val}
    </span>
  )
}

interface PillProps {
  value?: number | string
  label?: string
  unit?: string
}
