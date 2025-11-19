# Tamagui Configuration

This document provides an overview of the Tamagui configuration for this project.

## Configuration Settings

**IMPORTANT:** These settings affect how you write Tamagui code in this project.

### Default Font: `body`

All text components will use the "body" font family by default.

### Theme Class Name on Root: `true`

Theme classes are applied to the root HTML element.

### Max Dark/Light Nesting: `2`

Maximum nesting depth for light/dark theme switching: 2 levels.

### Web Container Type: `inline-size`

Enables web-specific container query optimizations.

## Shorthand Properties

These shorthand properties are available for styling:

- `ac` → `alignContent`
- `ai` → `alignItems`
- `als` → `alignSelf`
- `b` → `bottom`
- `bbc` → `borderBottomColor`
- `bblr` → `borderBottomLeftRadius`
- `bbrr` → `borderBottomRightRadius`
- `bbs` → `borderBottomStyle`
- `bbw` → `borderBottomWidth`
- `bc` → `borderColor`
- `bg` → `backgroundColor`
- `blc` → `borderLeftColor`
- `bls` → `borderLeftStyle`
- `blw` → `borderLeftWidth`
- `br` → `borderRadius`
- `brc` → `borderRightColor`
- `brs` → `borderRightStyle`
- `brw` → `borderRightWidth`
- `bs` → `borderStyle`
- `btc` → `borderTopColor`
- `btlr` → `borderTopLeftRadius`
- `btrr` → `borderTopRightRadius`
- `bts` → `borderTopStyle`
- `btw` → `borderTopWidth`
- `bw` → `borderWidth`
- `bxs` → `boxSizing`
- `bxsh` → `boxShadow`
- `col` → `color`
- `cur` → `cursor`
- `dsp` → `display`
- `f` → `flex`
- `fb` → `flexBasis`
- `fd` → `flexDirection`
- `ff` → `fontFamily`
- `fg` → `flexGrow`
- `fos` → `fontSize`
- `fost` → `fontStyle`
- `fow` → `fontWeight`
- `fs` → `flexShrink`
- `fw` → `flexWrap`
- `h` → `height`
- `jc` → `justifyContent`
- `l` → `left`
- `lh` → `lineHeight`
- `ls` → `letterSpacing`
- `m` → `margin`
- `mah` → `maxHeight`
- `maw` → `maxWidth`
- `mb` → `marginBottom`
- `mih` → `minHeight`
- `miw` → `minWidth`
- `ml` → `marginLeft`
- `mr` → `marginRight`
- `mt` → `marginTop`
- `mx` → `marginHorizontal`
- `my` → `marginVertical`
- `o` → `opacity`
- `ov` → `overflow`
- `ox` → `overflowX`
- `oy` → `overflowY`
- `p` → `padding`
- `pb` → `paddingBottom`
- `pe` → `pointerEvents`
- `pl` → `paddingLeft`
- `pos` → `position`
- `pr` → `paddingRight`
- `pt` → `paddingTop`
- `px` → `paddingHorizontal`
- `py` → `paddingVertical`
- `r` → `right`
- `shac` → `shadowColor`
- `shar` → `shadowRadius`
- `shof` → `shadowOffset`
- `shop` → `shadowOpacity`
- `t` → `top`
- `ta` → `textAlign`
- `tt` → `textTransform`
- `ussel` → `userSelect`
- `w` → `width`
- `ww` → `wordWrap`
- `zi` → `zIndex`

## Themes

Themes are organized hierarchically and can be combined:

**Level 1 (Base):**

- dark
- light

**Level 2 (Color Schemes):**

- accent
- black
- blue
- burgundy
- cyan
- forest
- gray
- green
- jade
- orange
- orangeRed
- pink
- purple
- red
- royalBlue
- supreme
- surface1
- surface2
- surface3
- tan
- teal
- white
- yellow

**Level 3 (Variants):**

- alt1
- alt2

**Component Themes:**

- Button
- Card
- Checkbox
- Input
- ListItem
- Progress
- ProgressIndicator
- RadioGroupItem
- SelectTrigger
- SliderThumb
- SliderTrack
- SliderTrackActive
- Switch
- SwitchThumb
- TextArea
- Tooltip
- TooltipArrow
- TooltipContent

### Theme Usage

Themes are combined hierarchically. For example, `light_blue_alt1_Button` combines:
- Base: `light`
- Color: `blue`
- Variant: `alt1`
- Component: `Button`

**Basic usage:**

```tsx
import { Button, Theme } from 'tamagui'

// Apply a theme to components
export default () => (
  <Theme name="dark">
    <Button>I'm a dark button</Button>
  </Theme>
)

// Themes nest and combine automatically
export default () => (
  <Theme name="dark">
    <Theme name="blue">
      <Button>Uses dark_blue theme</Button>
    </Theme>
  </Theme>
)
```

**Accessing theme values:**

Components can access theme values using `$` token syntax:

```tsx
<Stack backgroundColor="$background" color="$color" />
```

**Special props:**

- `inverse`: Automatically swaps light ↔ dark themes
- `reset`: Reverts to grandparent theme

## Tokens

Tokens are design system values that can be referenced using the `$` prefix.

### Space Tokens

- `-20`: -186
- `-19`: -172
- `-18`: -158
- `-17`: -144
- `-16`: -144
- `-15`: -130
- `-14`: -116
- `-13`: -102
- `-12`: -88
- `-11`: -74
- `-10`: -60
- `-9`: -53
- `-8`: -46
- `-7`: -39
- `-6`: -32
- `-5`: -24
- `-4.5`: -21
- `-4`: -18
- `-3.5`: -16
- `-3`: -13
- `-2.5`: -10
- `-2`: -7
- `-1.5`: -4
- `-1`: -2
- `-0.75`: -1.5
- `-0.5`: -1
- `-0.25`: -0.5
- `-true`: -18
- `0`: 0
- `0.25`: 0.5
- `0.5`: 1
- `0.75`: 1.5
- `1`: 2
- `1.5`: 4
- `2`: 7
- `2.5`: 10
- `3`: 13
- `3.5`: 16
- `4`: 18
- `4.5`: 21
- `5`: 24
- `6`: 32
- `7`: 39
- `8`: 46
- `9`: 53
- `10`: 60
- `11`: 74
- `12`: 88
- `13`: 102
- `14`: 116
- `15`: 130
- `16`: 144
- `17`: 144
- `18`: 158
- `19`: 172
- `20`: 186
- `true`: 18

### Size Tokens

- `0`: 0
- `0.25`: 2
- `0.5`: 4
- `0.75`: 8
- `1`: 20
- `1.5`: 24
- `2`: 28
- `2.5`: 32
- `3`: 36
- `3.5`: 40
- `4`: 44
- `4.5`: 48
- `5`: 52
- `6`: 64
- `7`: 74
- `8`: 84
- `9`: 94
- `10`: 104
- `11`: 124
- `12`: 144
- `13`: 164
- `14`: 184
- `15`: 204
- `16`: 224
- `17`: 224
- `18`: 244
- `19`: 264
- `20`: 284
- `true`: 44

### Radius Tokens

- `0`: 0
- `1`: 3
- `2`: 5
- `3`: 7
- `4`: 9
- `5`: 10
- `6`: 16
- `7`: 19
- `8`: 22
- `9`: 26
- `10`: 34
- `11`: 42
- `12`: 50
- `true`: 9

### Z-Index Tokens

- `0`: 0
- `1`: 100
- `2`: 200
- `3`: 300
- `4`: 400
- `5`: 500

### Color Tokens

- `black0`: rgba(10,10,10,0)
- `black025`: rgba(10,10,10,0.25)
- `black05`: rgba(10,10,10,0.5)
- `black075`: rgba(10,10,10,0.75)
- `black1`: #050505
- `black10`: #626262
- `black11`: #a5a5a5
- `black12`: #fff
- `black2`: #151515
- `black3`: #191919
- `black4`: #232323
- `black5`: #282828
- `black6`: #323232
- `black7`: #424242
- `black8`: #494949
- `black9`: #545454
- `blue10Dark`: hsl(209, 100%, 60.6%)
- `blue10Light`: hsl(208, 100%, 47.3%)
- `blue11Dark`: hsl(210, 100%, 66.1%)
- `blue11Light`: hsl(211, 100%, 43.2%)
- `blue12Dark`: hsl(206, 98.0%, 95.8%)
- `blue12Light`: hsl(211, 100%, 15.0%)
- `blue1Dark`: hsl(212, 35.0%, 9.2%)
- `blue1Light`: hsl(206, 100%, 99.2%)
- `blue2Dark`: hsl(216, 50.0%, 11.8%)
- `blue2Light`: hsl(210, 100%, 98.0%)
- `blue3Dark`: hsl(214, 59.4%, 15.3%)
- `blue3Light`: hsl(209, 100%, 96.5%)
- `blue4Dark`: hsl(214, 65.8%, 17.9%)
- `blue4Light`: hsl(210, 98.8%, 94.0%)
- `blue5Dark`: hsl(213, 71.2%, 20.2%)
- `blue5Light`: hsl(209, 95.0%, 90.1%)
- `blue6Dark`: hsl(212, 77.4%, 23.1%)
- `blue6Light`: hsl(209, 81.2%, 84.5%)
- `blue7Dark`: hsl(211, 85.1%, 27.4%)
- `blue7Light`: hsl(208, 77.5%, 76.9%)
- `blue8Dark`: hsl(211, 89.7%, 34.1%)
- `blue8Light`: hsl(206, 81.9%, 65.3%)
- `blue9Dark`: hsl(206, 100%, 50.0%)
- `blue9Light`: hsl(206, 100%, 50.0%)
- `gray10Dark`: hsl(0, 0%, 49.4%)
- `gray10Light`: hsl(0, 0%, 52.3%)
- `gray11Dark`: hsl(0, 0%, 62.8%)
- `gray11Light`: hsl(0, 0%, 43.5%)
- `gray12Dark`: hsl(0, 0%, 93.0%)
- `gray12Light`: hsl(0, 0%, 9.0%)
- `gray1Dark`: hsl(0, 0%, 8.5%)
- `gray1Light`: hsl(0, 0%, 99.0%)
- `gray2Dark`: hsl(0, 0%, 11.0%)
- `gray2Light`: hsl(0, 0%, 97.3%)
- `gray3Dark`: hsl(0, 0%, 13.6%)
- `gray3Light`: hsl(0, 0%, 95.1%)
- `gray4Dark`: hsl(0, 0%, 15.8%)
- `gray4Light`: hsl(0, 0%, 93.0%)
- `gray5Dark`: hsl(0, 0%, 17.9%)
- `gray5Light`: hsl(0, 0%, 90.9%)
- `gray6Dark`: hsl(0, 0%, 20.5%)
- `gray6Light`: hsl(0, 0%, 88.7%)
- `gray7Dark`: hsl(0, 0%, 24.3%)
- `gray7Light`: hsl(0, 0%, 85.8%)
- `gray8Dark`: hsl(0, 0%, 31.2%)
- `gray8Light`: hsl(0, 0%, 78.0%)
- `gray9Dark`: hsl(0, 0%, 43.9%)
- `gray9Light`: hsl(0, 0%, 56.1%)
- `green10Dark`: hsl(151, 49.3%, 46.5%)
- `green10Light`: hsl(152, 57.5%, 37.6%)
- `green11Dark`: hsl(151, 50.0%, 53.2%)
- `green11Light`: hsl(153, 67.0%, 28.5%)
- `green12Dark`: hsl(137, 72.0%, 94.0%)
- `green12Light`: hsl(155, 40.0%, 14.0%)
- `green1Dark`: hsl(146, 30.0%, 7.4%)
- `green1Light`: hsl(136, 50.0%, 98.9%)
- `green2Dark`: hsl(155, 44.2%, 8.4%)
- `green2Light`: hsl(138, 62.5%, 96.9%)
- `green3Dark`: hsl(155, 46.7%, 10.9%)
- `green3Light`: hsl(139, 55.2%, 94.5%)
- `green4Dark`: hsl(154, 48.4%, 12.9%)
- `green4Light`: hsl(140, 48.7%, 91.0%)
- `green5Dark`: hsl(154, 49.7%, 14.9%)
- `green5Light`: hsl(141, 43.7%, 86.0%)
- `green6Dark`: hsl(154, 50.9%, 17.6%)
- `green6Light`: hsl(143, 40.3%, 79.0%)
- `green7Dark`: hsl(153, 51.8%, 21.8%)
- `green7Light`: hsl(146, 38.5%, 69.0%)
- `green8Dark`: hsl(151, 51.7%, 28.4%)
- `green8Light`: hsl(151, 40.2%, 54.1%)
- `green9Dark`: hsl(151, 55.0%, 41.5%)
- `green9Light`: hsl(151, 55.0%, 41.5%)
- `orange10Dark`: hsl(24, 100%, 58.5%)
- `orange10Light`: hsl(24, 100%, 46.5%)
- `orange11Dark`: hsl(24, 100%, 62.2%)
- `orange11Light`: hsl(24, 100%, 37.0%)
- `orange12Dark`: hsl(24, 97.0%, 93.2%)
- `orange12Light`: hsl(15, 60.0%, 17.0%)
- `orange1Dark`: hsl(30, 70.0%, 7.2%)
- `orange1Light`: hsl(24, 70.0%, 99.0%)
- `orange2Dark`: hsl(28, 100%, 8.4%)
- `orange2Light`: hsl(24, 83.3%, 97.6%)
- `orange3Dark`: hsl(26, 91.1%, 11.6%)
- `orange3Light`: hsl(24, 100%, 95.3%)
- `orange4Dark`: hsl(25, 88.3%, 14.1%)
- `orange4Light`: hsl(25, 100%, 92.2%)
- `orange5Dark`: hsl(24, 87.6%, 16.6%)
- `orange5Light`: hsl(25, 100%, 88.2%)
- `orange6Dark`: hsl(24, 88.6%, 19.8%)
- `orange6Light`: hsl(25, 100%, 82.8%)
- `orange7Dark`: hsl(24, 92.4%, 24.0%)
- `orange7Light`: hsl(24, 100%, 75.3%)
- `orange8Dark`: hsl(25, 100%, 29.0%)
- `orange8Light`: hsl(24, 94.5%, 64.3%)
- `orange9Dark`: hsl(24, 94.0%, 50.0%)
- `orange9Light`: hsl(24, 94.0%, 50.0%)
- `pink10Dark`: hsl(323, 72.8%, 59.2%)
- `pink10Light`: hsl(322, 63.9%, 50.7%)
- `pink11Dark`: hsl(325, 90.0%, 66.4%)
- `pink11Light`: hsl(322, 75.0%, 46.0%)
- `pink12Dark`: hsl(322, 90.0%, 95.8%)
- `pink12Light`: hsl(320, 70.0%, 13.5%)
- `pink1Dark`: hsl(318, 25.0%, 9.6%)
- `pink1Light`: hsl(322, 100%, 99.4%)
- `pink2Dark`: hsl(319, 32.2%, 11.6%)
- `pink2Light`: hsl(323, 100%, 98.4%)
- `pink3Dark`: hsl(319, 41.0%, 16.0%)
- `pink3Light`: hsl(323, 86.3%, 96.5%)
- `pink4Dark`: hsl(320, 45.4%, 18.7%)
- `pink4Light`: hsl(323, 78.7%, 94.2%)
- `pink5Dark`: hsl(320, 49.0%, 21.1%)
- `pink5Light`: hsl(323, 72.2%, 91.1%)
- `pink6Dark`: hsl(321, 53.6%, 24.4%)
- `pink6Light`: hsl(323, 66.3%, 86.6%)
- `pink7Dark`: hsl(321, 61.1%, 29.7%)
- `pink7Light`: hsl(323, 62.0%, 80.1%)
- `pink8Dark`: hsl(322, 74.9%, 37.5%)
- `pink8Light`: hsl(323, 60.3%, 72.4%)
- `pink9Dark`: hsl(322, 65.0%, 54.5%)
- `pink9Light`: hsl(322, 65.0%, 54.5%)
- `purple10Dark`: hsl(273, 57.3%, 59.1%)
- `purple10Light`: hsl(272, 46.8%, 50.3%)
- `purple11Dark`: hsl(275, 80.0%, 71.0%)
- `purple11Light`: hsl(272, 50.0%, 45.8%)
- `purple12Dark`: hsl(279, 75.0%, 95.7%)
- `purple12Light`: hsl(272, 66.0%, 16.0%)
- `purple1Dark`: hsl(284, 20.0%, 9.6%)
- `purple1Light`: hsl(280, 65.0%, 99.4%)
- `purple2Dark`: hsl(283, 30.0%, 11.8%)
- `purple2Light`: hsl(276, 100%, 99.0%)
- `purple3Dark`: hsl(281, 37.5%, 16.5%)
- `purple3Light`: hsl(276, 83.1%, 97.0%)
- `purple4Dark`: hsl(280, 41.2%, 20.0%)
- `purple4Light`: hsl(275, 76.4%, 94.7%)
- `purple5Dark`: hsl(279, 43.8%, 23.3%)
- `purple5Light`: hsl(275, 70.8%, 91.8%)
- `purple6Dark`: hsl(277, 46.4%, 27.5%)
- `purple6Light`: hsl(274, 65.4%, 87.8%)
- `purple7Dark`: hsl(275, 49.3%, 34.6%)
- `purple7Light`: hsl(273, 61.0%, 81.7%)
- `purple8Dark`: hsl(272, 52.1%, 45.9%)
- `purple8Light`: hsl(272, 60.0%, 73.5%)
- `purple9Dark`: hsl(272, 51.0%, 54.0%)
- `purple9Light`: hsl(272, 51.0%, 54.0%)
- `red10Dark`: hsl(358, 85.3%, 64.0%)
- `red10Light`: hsl(358, 69.4%, 55.2%)
- `red11Dark`: hsl(358, 100%, 69.5%)
- `red11Light`: hsl(358, 65.0%, 48.7%)
- `red12Dark`: hsl(351, 89.0%, 96.0%)
- `red12Light`: hsl(354, 50.0%, 14.6%)
- `red1Dark`: hsl(353, 23.0%, 9.8%)
- `red1Light`: hsl(359, 100%, 99.4%)
- `red2Dark`: hsl(357, 34.4%, 12.0%)
- `red2Light`: hsl(359, 100%, 98.6%)
- `red3Dark`: hsl(356, 43.4%, 16.4%)
- `red3Light`: hsl(360, 100%, 96.8%)
- `red4Dark`: hsl(356, 47.6%, 19.2%)
- `red4Light`: hsl(360, 97.9%, 94.8%)
- `red5Dark`: hsl(356, 51.1%, 21.9%)
- `red5Light`: hsl(360, 90.2%, 91.9%)
- `red6Dark`: hsl(356, 55.2%, 25.9%)
- `red6Light`: hsl(360, 81.7%, 87.8%)
- `red7Dark`: hsl(357, 60.2%, 31.8%)
- `red7Light`: hsl(359, 74.2%, 81.7%)
- `red8Dark`: hsl(358, 65.0%, 40.4%)
- `red8Light`: hsl(359, 69.5%, 74.3%)
- `red9Dark`: hsl(358, 75.0%, 59.0%)
- `red9Light`: hsl(358, 75.0%, 59.0%)
- `white0`: rgba(255,255,255,0)
- `white025`: rgba(255,255,255,0.25)
- `white05`: rgba(255,255,255,0.5)
- `white075`: rgba(255,255,255,0.75)
- `white1`: #fff
- `white10`: hsl(0, 0%, 50.3%)
- `white11`: hsl(0, 0%, 42.5%)
- `white12`: hsl(0, 0%, 9.0%)
- `white2`: #f8f8f8
- `white3`: hsl(0, 0%, 96.3%)
- `white4`: hsl(0, 0%, 94.1%)
- `white5`: hsl(0, 0%, 92.0%)
- `white6`: hsl(0, 0%, 90.0%)
- `white7`: hsl(0, 0%, 88.5%)
- `white8`: hsl(0, 0%, 81.0%)
- `white9`: hsl(0, 0%, 56.1%)
- `yellow10Dark`: hsl(54, 100%, 68.0%)
- `yellow10Light`: hsl(50, 100%, 48.5%)
- `yellow11Dark`: hsl(48, 100%, 47.0%)
- `yellow11Light`: hsl(42, 100%, 29.0%)
- `yellow12Dark`: hsl(53, 100%, 91.0%)
- `yellow12Light`: hsl(40, 55.0%, 13.5%)
- `yellow1Dark`: hsl(45, 100%, 5.5%)
- `yellow1Light`: hsl(60, 54.0%, 98.5%)
- `yellow2Dark`: hsl(46, 100%, 6.7%)
- `yellow2Light`: hsl(52, 100%, 95.5%)
- `yellow3Dark`: hsl(45, 100%, 8.7%)
- `yellow3Light`: hsl(55, 100%, 90.9%)
- `yellow4Dark`: hsl(45, 100%, 10.4%)
- `yellow4Light`: hsl(54, 100%, 86.6%)
- `yellow5Dark`: hsl(47, 100%, 12.1%)
- `yellow5Light`: hsl(52, 97.9%, 82.0%)
- `yellow6Dark`: hsl(49, 100%, 14.3%)
- `yellow6Light`: hsl(50, 89.4%, 76.1%)
- `yellow7Dark`: hsl(49, 90.3%, 18.4%)
- `yellow7Light`: hsl(47, 80.4%, 68.0%)
- `yellow8Dark`: hsl(50, 100%, 22.0%)
- `yellow8Light`: hsl(48, 100%, 46.1%)
- `yellow9Dark`: hsl(53, 92.0%, 50.0%)
- `yellow9Light`: hsl(53, 92.0%, 50.0%)

### Token Usage

Tokens can be used in component props with the `$` prefix:

```tsx
// Space tokens - for margin, padding, gap
<Stack padding="$4" gap="$2" margin="$3" />

// Size tokens - for width, height, dimensions
<Stack width="$10" height="$6" />

// Color tokens - for colors and backgrounds
<Stack backgroundColor="$blue5" color="$gray12" />

// Radius tokens - for border-radius
<Stack borderRadius="$4" />
```

## Media Queries

Available responsive breakpoints:

- **gtLarge**: {"minWidth":901}
- **gtLg**: {"minWidth":1281}
- **gtMd**: {"minWidth":1021}
- **gtMedium**: {"minWidth":781}
- **gtSm**: {"minWidth":801}
- **gtSmall**: {"minWidth":621}
- **gtTiny**: {"minWidth":501}
- **gtXl**: {"minWidth":1651}
- **gtXs**: {"minWidth":661}
- **gtXxs**: {"minWidth":391}
- **large**: {"maxWidth":900}
- **lg**: {"maxWidth":1280}
- **lg_xl**: {"maxWidth":1400}
- **max2Xl**: {"maxWidth":1536}
- **max2xs**: {"maxWidth":340}
- **maxLg**: {"maxWidth":1024}
- **maxMd**: {"maxWidth":768}
- **maxSm**: {"maxWidth":640}
- **maxXl**: {"maxWidth":1280}
- **maxXs**: {"maxWidth":460}
- **md**: {"maxWidth":1020}
- **medium**: {"maxWidth":780}
- **pointerFine**: {"pointer":"fine"}
- **sm**: {"maxWidth":800}
- **small**: {"maxWidth":620}
- **tiny**: {"maxWidth":500}
- **xl**: {"maxWidth":1650}
- **xs**: {"maxWidth":660}
- **xxs**: {"maxWidth":390}

### Media Query Usage

Media queries can be used as style props or with the `useMedia` hook:

```tsx
// As style props (prefix with $)
<Stack width="100%" $gtLarge={{ width: "50%" }} />

// Using the useMedia hook
import { useMedia } from 'tamagui'

const media = useMedia()
if (media.gtLarge) {
  // Render for this breakpoint
}
```

## Fonts

Available font families:

- body
- cherryBomb
- heading
- mono
- silkscreen

## Animations

Available animation presets:

- 100ms
- 200ms
- 75ms
- bouncy
- kindaBouncy
- lazy
- medium
- quick
- quicker
- quickest
- slow
- slowest
- superBouncy
- superLazy
- tooltip

## Components

The following components are available:

- AlertDialogAction
- AlertDialogCancel
- AlertDialogDescription
- AlertDialogOverlay
- AlertDialogTitle
- AlertDialogTrigger
- Anchor
- Article
- Aside
- AvatarFallback
  - AvatarFallback.Frame
- AvatarFrame
- Button
  - Button.Frame
  - Button.Text
- Card
  - Card.Background
  - Card.Footer
  - Card.Frame
  - Card.Header
- Checkbox
  - Checkbox.Frame
  - Checkbox.IndicatorFrame
- Circle
- DialogClose
- DialogContent
- DialogDescription
- DialogOverlay
  - DialogOverlay.Frame
- DialogPortalFrame
- DialogTitle
- DialogTrigger
- EnsureFlexed
- Fieldset
- Footer
- Form
  - Form.Frame
  - Form.Trigger
- Frame
- Group
  - Group.Frame
- H1
- H2
- H3
- H4
- H5
- H6
- Handle
- Header
- Heading
- Image
- Input
  - Input.Frame
- Label
  - Label.Frame
- ListItem
  - ListItem.Frame
  - ListItem.Subtitle
  - ListItem.Text
  - ListItem.Title
- Main
- Nav
- Overlay
- Paragraph
- PopoverArrow
- PopoverContent
- PopperAnchor
- PopperArrowFrame
- PopperContentFrame
- Progress
  - Progress.Frame
  - Progress.Indicator
  - Progress.IndicatorFrame
- RadioGroup
  - RadioGroup.Frame
  - RadioGroup.IndicatorFrame
  - RadioGroup.ItemFrame
- ScrollView
- Section
- SelectGroupFrame
- SelectIcon
- SelectSeparator
- Separator
- SheetHandleFrame
- SheetOverlayFrame
- SizableStack
- SizableText
- SliderFrame
- SliderThumb
  - SliderThumb.Frame
- SliderTrackActiveFrame
- SliderTrackFrame
- Spacer
- Spacer
- Spinner
- Square
- Stack
- Stack
- Switch
  - Switch.Frame
  - Switch.Thumb
- Tabs
- Text
  - Text.Area
  - Text.AreaFrame
- ThemeableStack
- Thumb
- View
- View
- VisuallyHidden
- XGroup
- XStack
- YGroup
- YStack
- ZStack

