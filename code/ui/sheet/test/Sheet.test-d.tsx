import { styled } from '@tamagui/core'
import {
  Sheet,
  SheetBackground,
  SheetContainer,
  SheetControlled,
  SheetHandle,
  SheetOverlay,
  SheetRoot,
} from '../src/Sheet'

const StyledHandle = styled(Sheet.Handle, {
  displayName: 'TypeTestSheetHandle',
  backgroundColor: 'background',
})

const StyledOverlay = styled(Sheet.Overlay, {
  displayName: 'TypeTestSheetOverlay',
  backgroundColor: 'shadow-color',
})

const StyledContainer = styled(Sheet.Container, {
  displayName: 'TypeTestSheetContainer',
  padding: '4',
})

const StyledBackground = styled(Sheet.Background, {
  displayName: 'TypeTestSheetBackground',
  borderTopLeftRadius: '4',
})

const StyledScrollView = styled(Sheet.ScrollView, {
  displayName: 'TypeTestSheetScrollView',
  flex: 1,
})

const root: typeof SheetRoot = Sheet.Root
const controlled: typeof SheetControlled = Sheet.Controlled
const handle: typeof SheetHandle = Sheet.Handle
const overlay: typeof SheetOverlay = Sheet.Overlay
const container: typeof SheetContainer = Sheet.Container
const background: typeof SheetBackground = Sheet.Background

void root
void controlled
void handle
void overlay
void container
void background

export const SheetPartsTypeTest = () => (
  <Sheet defaultOpen>
    <StyledOverlay />
    <StyledHandle />
    <StyledContainer>
      <StyledBackground />
      <StyledScrollView />
    </StyledContainer>
  </Sheet>
)

export const SheetDirectPartShorthandsTypeTest = () => (
  <Sheet defaultOpen>
    <Sheet.Overlay bg="shadow-color" o={0.45} />
    <Sheet.Handle h={10} bg="background" t={-40} pos="absolute" />
    <Sheet.Container h={240} p="4">
      <Sheet.Background bg="background" o={1} />
      <Sheet.ScrollView h={200} p="2" pos="relative" />
    </Sheet.Container>
  </Sheet>
)

export const SheetRootTypeTest = () => <Sheet.Root defaultOpen />

export const SheetControlledTypeTest = () => <Sheet.Controlled defaultOpen />

// @ts-expect-error Sheet.Controlled receives its open state from SheetController or Adapt
export const SheetControlledOpenTypeTest = () => <Sheet.Controlled open />
