import { describe, expect, it } from 'vitest'
import { insertCssImport } from '../src/build'

describe('insertCssImport', () => {
  const cssImport = 'import "./styles.css"'

  it('should prepend CSS import when no directive is present', () => {
    const js = `import { useState } from 'react'\n\nexport function Component() {}`
    const result = insertCssImport(js, cssImport)
    expect(result).toBe(`import "./styles.css"\nimport { useState } from 'react'\n\nexport function Component() {}`)
  })

  it('should insert CSS import after "use client" directive with double quotes', () => {
    const js = `"use client"\nimport { useState } from 'react'\n\nexport function Component() {}`
    const result = insertCssImport(js, cssImport)
    expect(result).toBe(`"use client"\nimport "./styles.css"\nimport { useState } from 'react'\n\nexport function Component() {}`)
  })

  it('should insert CSS import after "use client" directive with single quotes', () => {
    const js = `'use client'\nimport { useState } from 'react'\n\nexport function Component() {}`
    const result = insertCssImport(js, cssImport)
    expect(result).toBe(`'use client'\nimport "./styles.css"\nimport { useState } from 'react'\n\nexport function Component() {}`)
  })

  it('should insert CSS import after "use server" directive', () => {
    const js = `"use server"\nimport { db } from './db'\n\nexport async function action() {}`
    const result = insertCssImport(js, cssImport)
    expect(result).toBe(`"use server"\nimport "./styles.css"\nimport { db } from './db'\n\nexport async function action() {}`)
  })

  it('should handle directive with semicolon', () => {
    const js = `"use client";\nimport { useState } from 'react'`
    const result = insertCssImport(js, cssImport)
    expect(result).toBe(`"use client";\nimport "./styles.css"\nimport { useState } from 'react'`)
  })

  it('should handle directive without newline after it', () => {
    const js = `"use client"import { useState } from 'react'`
    const result = insertCssImport(js, cssImport)
    expect(result).toBe(`"use client"import "./styles.css"\nimport { useState } from 'react'`)
  })

  it('should not match "use client" that appears later in the file', () => {
    const js = `import { useState } from 'react'\nconst x = "use client"\nexport function Component() {}`
    const result = insertCssImport(js, cssImport)
    expect(result).toBe(`import "./styles.css"\nimport { useState } from 'react'\nconst x = "use client"\nexport function Component() {}`)
  })

  it('should handle empty file', () => {
    const js = ''
    const result = insertCssImport(js, cssImport)
    expect(result).toBe(`import "./styles.css"\n`)
  })

  it('should handle file with only directive', () => {
    const js = `"use client"`
    const result = insertCssImport(js, cssImport)
    expect(result).toBe(`"use client"import "./styles.css"\n`)
  })

  it('should preserve multiple newlines after directive', () => {
    const js = `"use client"\n\n\nimport { useState } from 'react'`
    const result = insertCssImport(js, cssImport)
    expect(result).toBe(`"use client"\nimport "./styles.css"\n\n\nimport { useState } from 'react'`)
  })
})
