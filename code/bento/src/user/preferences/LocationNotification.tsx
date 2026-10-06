import { LinearGradient } from '@tamagui/linear-gradient'
import { Check, ChevronDown, ChevronUp, Info, Mail } from '../../icons'
import { useMemo, useState } from 'react'
import {
  Adapt,
  Button,
  Label,
  Select,
  Separator,
  Sheet,
  Theme,
  View,
  styled,
  Text,
  SizableText,
} from 'tamagui'
import { RadioGroup } from '../../forms/radiogroups/components/radioParts'

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

// convert country code to flag emoji (e.g., "US" -> "🇺🇸")
function countryCodeToFlag(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

const languagesArray = languages.map((item) => ({
  name: item.name,
  shortcut: item.shortcut,
  flag: countryCodeToFlag(item.flag),
}))

const locationsArray = countries.map((item) => ({
  name: item.name,
  flag: countryCodeToFlag(item.flag),
}))

type DataItem = {
  name: string
  shortcut?: string
  flag: string
}

function GeneralSelect({
  data,
  ...rest
}: React.ComponentProps<typeof Select> & { data: DataItem[] }) {
  const [val, setVal] = useState('0')

  const selectedItem = data[Number(val)]

  const selectList = useMemo(
    () =>
      data.map((item, i) => {
        return (
          <Select.Item
            key={item.name}
            gap="3"
            justify="center"
            items="center"
            value={`${i}`}
          >
            <Text fontSize="5">{item.flag}</Text>
            <SizableText mr="auto">{`${item.name} ${
              item.shortcut ? `(${item.shortcut})` : ''
            }`}</SizableText>
            <Select.ItemIndicator marginLeft="auto">
              <Check size={16} />
            </Select.ItemIndicator>
          </Select.Item>
        )
      }),
    [data]
  )

  return (
    <Select
      value={val}
      onValueChange={(value) => setVal(String(value))}
      disablePreventBodyScroll
      zIndex={200000}
      {...rest}
    >
      <Select.Trigger width="100%" rounded="4">
        <View flexDirection="row" gap="3" justify="center" items="center">
          <Text fontSize="5">{selectedItem.flag}</Text>
          <SizableText mr="auto">{`${selectedItem.name} ${
            selectedItem.shortcut ? `(${selectedItem.shortcut})` : ''
          }`}</SizableText>
        </View>
        <Select.Icon>
          <ChevronDown />
        </Select.Icon>
      </Select.Trigger>

      <Adapt when="max-md" platform="touch">
        <Sheet dismissOnSnapToBottom>
          <Sheet.Container>
            <Sheet.Background />
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Container>
          <Sheet.Overlay transition="lazy" opacity="enter:0 exit:0" />
        </Sheet>
      </Adapt>

      <Select.Content>
        <Select.ScrollUpButton
          items="center"
          justify="center"
          position="relative"
          width="100%"
          height="3"
        >
          <View flexDirection="column" z={10}>
            <ChevronUp size={20} />
          </View>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            rounded="4"
            position="absolute"
            inset={0}
            colors={['background', 'transparent']}
          />
        </Select.ScrollUpButton>

        <Select.Viewport
          // to do animations:
          // transition="quick"
          minW={200}
          borderWidth={1}
          borderColor="border-color"
          rounded="4"
        >
          <Select.Group>{selectList}</Select.Group>
        </Select.Viewport>

        <Select.ScrollDownButton
          items="center"
          justify="center"
          position="relative"
          width="100%"
          height="3"
        >
          <View flexDirection="column" z={10}>
            <ChevronDown size={20} />
          </View>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            rounded="4"
            position="absolute"
            inset={0}
            colors={['transparent', 'background']}
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
      gap="4"
      p="4"
      rounded={10}
      bg="background"
      width={520}
      maxW="100%"
      borderWidth="1.5px @max-sm/window:0px"
      borderColor="border-color"
      boxShadow="(0 0 18px shadow-color) @max-sm/window:none"
    >
      <View flexDirection="row" gap="4 @max-sm/window:3" width="100%">
        <Button icon={Mail} circular variant="outlined" />
        <View flexDirection="column" shrink={1}>
          <SizableText size="5">Update your Email Preferences</SizableText>
          <Theme name="level2">
            <SizableText size="3">
              Set your language and delivery preferences below.
            </SizableText>
          </Theme>
        </View>
      </View>
      {/* minus margin will cancel padding */}
      <Separator mx="-4" />
      <View flexDirection="column" gap="4">
        <View flexDirection="column" gap="1">
          <Label size="4" lineHeight="1" fontWeight="600" htmlFor="select-language">
            Language:
          </Label>
          <GeneralSelect id="select-language" data={languagesArray} />
        </View>
        <View flexDirection="column" gap="1">
          <Label size="4" lineHeight="1" fontWeight="600" htmlFor="select-location">
            Location:
          </Label>
          <GeneralSelect id="select-location" data={locationsArray} />
          <Theme name="level2">
            <SizableText size="3">
              Please choose a location for relevant information.
            </SizableText>
          </Theme>
        </View>
      </View>
      <Separator mx="-4" />
      <View flexDirection="column" gap="4">
        <RadioList />
        <Theme name="green">
          <Banner>Change your email preferences at any time</Banner>
        </Theme>
      </View>
      <Separator mx="-4" />
      <View flexDirection="row" gap="3">
        <Button flex={1}>
          <Button.Text>Cancel</Button.Text>
        </Button>

        <Button theme="accent" flex={1}>
          <Button.Text>Save</Button.Text>
        </Button>
      </View>
    </View>
  )
}

const Banner = ({ children }: { children?: React.ReactNode }) => {
  return (
    <View flexDirection="row" items="center" bg="color-6" p="3" gap="2" rounded="4">
      <Info size={16} />
      <SizableText size="sm">{children}</SizableText>
    </View>
  )
}

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
      <View flexDirection="column" gap="3">
        {radioData.map(({ title, desc }) => (
          <View
            flexDirection="column"
            borderWidth={1}
            borderColor={`${title === value ? 'color-6' : 'color-4'}`}
            cursor="pointer"
            rounded="7"
            p="4"
            key={title}
            onPress={() => setValue(title)}
          >
            <View flexDirection="column">
              <View flexDirection="row" justify="space-between">
                <SizableText size="5">{title}</SizableText>
                <RadioGroup.Item id={title} value={title}>
                  <RadioGroup.Indicator
                    width="33%"
                    height="33%"
                    rounded={1000}
                    bg="color"
                  />
                </RadioGroup.Item>
              </View>
            </View>
            <SizableText fontWeight="300" color="color-8" size="4">
              {desc}
            </SizableText>
          </View>
        ))}
      </View>
    </RadioGroup>
  )
}
