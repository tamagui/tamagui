import { styled } from '@tamagui/core'
import { describe, expect, test } from 'vitest'
import { Sheet } from '../src/Sheet'
import { isSheetOverlayComponent } from '../src/SheetImplementationCustom'

describe('Sheet public behavior parts', () => {
  test('keeps the callable root and direct part aliases', () => {
    expect(Sheet.Root).toBe(Sheet)
    expect(Sheet.Controlled).toBe(Sheet.Root)
    expect(Sheet.Container.staticConfig).toBeDefined()
    expect(Sheet.Background.staticConfig).toBeDefined()
    expect(Sheet.Overlay.staticConfig).toBeDefined()
    expect(Sheet.Handle.staticConfig).toBeDefined()
    expect(Sheet.ScrollView.staticConfig).toBeDefined()
  })

  test('recognizes named styled overlays through their ancestry', () => {
    const NamedOverlay = styled(Sheet.Overlay, {
      name: 'NamedSheetOverlay',
      backgroundColor: '$shadowColor',
    })
    const NestedNamedOverlay = styled(NamedOverlay, {
      name: 'NestedNamedSheetOverlay',
    })
    const OrdinaryPart = styled(Sheet.Container, {
      name: 'OrdinarySheetPart',
    })
    const UntypedOptIn = Object.assign(() => null, { isSheetOverlay: true })

    expect(isSheetOverlayComponent(Sheet.Overlay)).toBe(true)
    expect(isSheetOverlayComponent(NamedOverlay)).toBe(true)
    expect(isSheetOverlayComponent(NestedNamedOverlay)).toBe(true)
    expect(isSheetOverlayComponent(OrdinaryPart)).toBe(false)
    expect(isSheetOverlayComponent(UntypedOptIn)).toBe(false)
  })
})
