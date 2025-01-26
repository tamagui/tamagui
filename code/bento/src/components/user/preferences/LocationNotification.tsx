import { getFontSized } from '@tamagui/get-font-sized'
import { LinearGradient } from '@tamagui/linear-gradient'
import { Check, ChevronDown, ChevronUp, Info, Mail } from '@tamagui/lucide-icons'
import { useMemo, useState } from 'react'
import type { FontSizeTokens, SelectProps } from 'tamagui'
import {
  Adapt,
  Button,
  Image,
  Label,
  RadioGroup,
  Select,
  Separator,
  Sheet,
  Theme,
  View,
  getTokenValue,
  styled,
  Text,
} from 'tamagui'

const languages = [
  { name: 'English', shortcut: 'EN', flag: 'US' },
  { name: 'Spanish', shortcut: 'ES', flag: 'ES' },
  { name: 'Italian', shortcut: 'IT', flag: 'IT' },
  { name: 'Portuguese', shortcut: 'PT', flag: 'PT' },
  { name: 'French', shortcut: 'FR', flag: 'FR' },
  { name: 'Arabic', shortcut: 'AR', flag: 'SA' },
  { name: 'German', shortcut: 'DE', flag: 'DE' },
  { name: 'Russian', shortcut: 'RU', flag: 'RU' },
  { name: 'Japanese', shortcut: 'JA', flag: 'JP' },
  { name: 'Chinese', shortcut: 'ZH', flag: 'CN' },
  { name: 'Korean', shortcut: 'KO', flag: 'KR' },
]

const countries = [
  { name: 'Japan', flag: 'JP' },
  { name: 'China', flag: 'CN' },
  { name: 'Korea', flag: 'KR' },
  { name: 'Spain', flag: 'ES' },
  { name: 'United States', flag: 'US' },
  { name: 'Italy', flag: 'IT' },
  { name: 'Portugal', flag: 'PT' },
  { name: 'France', flag: 'FR' },
  { name: 'Saudi Arabia', flag: 'SA' },
  { name: 'Germany', flag: 'DE' },
  { name: 'Russia', flag: 'RU' },
]

const languagesArray = Array.from({ length: 10 }, (_, i) => ({
  name: languages[i].name,
  shortcut: languages[i].shortcut,
  flag: `https://flagsapi.com/${languages[i].flag}/flat/64.png`,
}))

const locationsArray = Array.from({ length: 10 }, (_, i) => ({
  name: countries[i].name,
  flag: `https://flagsapi.com/${countries[i].flag}/flat/64.png`,
}))

type DataItem = {
  name: string
  shortcut?: string
  flag: string
}

function GeneralSelect({ data, ...rest }: SelectProps & { data: DataItem[] }) {
  const [val, setVal] = useState('0')

  const selectedItem = data[Number(val)]

  return (
    <Select
      id="food"
      value={val}
      onValueChange={setVal}
      disablePreventBodyScroll
      {...rest}
    >
      <Select.Trigger width="100%" iconAfter={ChevronDown}>
        <View flexDirection="row" gap="$3" justifyContent="center" alignItems="center">
          <Image source={{ uri: selectedItem.flag }} width={20} height={20} />
          <SizableText marginRight="auto">{`${selectedItem.name} ${
            selectedItem.shortcut ? `(${selectedItem.shortcut})` : ''
          }`}</SizableText>
        </View>
      </Select.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet
          modal
          dismissOnSnapToBottom
          animationConfig={{
            type: 'spring',
            damping: 20,
            mass: 1.2,
            stiffness: 250,
          }}
        >
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Select.Content zIndex={200000}>
        <Select.ScrollUpButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <View flexDirection="column" zIndex={10}>
            <ChevronUp size={20} />
          </View>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={['$background', 'transparent']}
            borderRadius="$4"
          />
        </Select.ScrollUpButton>

        <Select.Viewport
          // to do animations:
          // animation="quick"
          // animateOnly={['transform', 'opacity']}
          // enterStyle={{ opacity: 0, y: -10 }}
          // exitStyle={{ opacity: 0, y: 10 }}
          miw={200}
        >
          <Select.Group>
            {/* for longer lists memoizing these is useful */}
            {useMemo(
              () =>
                data.map((item, i) => {
                  return (
                    <Select.Item
                      index={i}
                      key={item.name}
                      gap="$3"
                      value={`${i}`}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Image source={{ uri: item.flag }} width={20} height={20} />
                      <SizableText marginRight="auto">{`${item.name} ${
                        item.shortcut ? `(${item.shortcut})` : ''
                      }`}</SizableText>
                      <Select.ItemIndicator marginLeft="auto">
                        <Check size={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                  )
                }),
              [data]
            )}
          </Select.Group>
        </Select.Viewport>

        <Select.ScrollDownButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <View flexDirection="column" zIndex={10}>
            <ChevronDown size={20} />
          </View>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={['transparent', '$background']}
            borderRadius="$4"
          />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select>
  )
}

/** ------ EXAMPLE ------ */
export function LocationNotification() {
  return (
    <View
      flexDirection="column"
      gap="$4"
      padding="$4"
      borderRadius={10}
      backgroundColor="$background"
      width={520}
      maxWidth="100%"
      borderWidth={1.5}
      borderColor="$borderColor"
      shadowColor="$shadowColor"
      shadowRadius="$4"
      $group-window-xs={{
        borderWidth: 0,
        shadowColor: 'transparent',
      }}
    >
      <View
        flexDirection="row"
        gap="$4"
        width="100%"
        $group-window-xs={{
          gap: '$3',
        }}
      >
        <Button icon={Mail} circular variant="outlined" />
        <View flexDirection="column" flexShrink={1}>
          <SizableText size="$5">Update your Email Preferences</SizableText>
          <Theme name="alt1">
            <SizableText size="$3">
              Set your language and delivery preferences below.
            </SizableText>
          </Theme>
        </View>
      </View>
      {/* minus margin will cancel padding */}
      <Separator marginHorizontal="$-4" />
      <View flexDirection="column" gap="$4">
        <View flexDirection="column" gap="$1">
          <Label size="$4" lineHeight="$1" htmlFor="select-language" fontWeight="600">
            Language:
          </Label>
          <GeneralSelect id="select-language" data={languagesArray} />
        </View>
        <View flexDirection="column" gap="$1">
          <Label size="$4" lineHeight="$1" htmlFor="select-location" fontWeight="600">
            Location:
          </Label>
          <GeneralSelect id="select-location" data={locationsArray} />
          <Theme name="alt1">
            <SizableText size="$3">
              Please choose a location for relevant information.
            </SizableText>
          </Theme>
        </View>
      </View>
      <Separator marginHorizontal="$-4" />
      <View flexDirection="column" gap="$4">
        <RadioList />
        <Theme name="green">
          <Banner>Change your email preferences at any time</Banner>
        </Theme>
      </View>
      <Separator marginHorizontal="$-4" />
      <View flexDirection="row" gap="$3">
        <Button flex={1}>
          <Button.Text>Cancel</Button.Text>
        </Button>
        <Button themeInverse flex={1}>
          <Button.Text>Save</Button.Text>
        </Button>
      </View>
    </View>
  )
}

LocationNotification.fileName = 'LocationNotification'

const Banner = ({
  size = '$3',
  children,
}: { size?: FontSizeTokens; children?: React.ReactNode }) => {
  return (
    <View
      flexDirection="row"
      alignItems="center"
      backgroundColor="$color7"
      padding={size}
      gap={size}
      borderRadius={'$4'}
    >
      <Info size={getTokenValue(size as any, 'size') * 0.5} />
      <SizableText size={size}>{children}</SizableText>
    </View>
  )
}

export const SizableText = styled(Text, {
  name: 'SizableText',
  fontFamily: '$body',

  variants: {
    size: {
      '...fontSize': getFontSized,
    },
  } as const,

  defaultVariants: {
    size: '$true',
  },
})
const radioData = [
  {
    title: 'Promotions',
    desc: 'Get notified of occasional deals and coupons.',
  },
  {
    title: 'The Weekly Update',
    desc: 'Development updates only in short form.',
  },
  {
    title: 'Big Announcements',
    desc: 'Updates about only major releases.',
  },
]

function RadioList() {
  const [value, setValue] = useState(radioData[0].title)
  return (
    <RadioGroup value={value} onValueChange={setValue}>
      <View flexDirection="column" gap="$3">
        {radioData.map(({ title, desc }) => (
          <View
            flexDirection="column"
            key={title}
            onPress={() => setValue(title)}
            borderWidth="$0.5"
            borderColor={title === value ? '$color7' : '$color4'}
            cursor="pointer"
            borderRadius={'$7'}
            padding="$4"
          >
            <View flexDirection="column">
              <View flexDirection="row" justifyContent="space-between">
                <SizableText fos="$5">{title}</SizableText>
                <RadioGroup.Item id={title} value={title}>
                  <RadioGroup.Indicator />
                </RadioGroup.Item>
              </View>
            </View>
            <SizableText fontWeight="300" col="$gray10" fos="$4">
              {desc}
            </SizableText>
          </View>
        ))}
      </View>
    </RadioGroup>
  )
}
