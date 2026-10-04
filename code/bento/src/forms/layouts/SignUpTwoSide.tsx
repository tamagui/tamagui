import { LinearGradient } from '@tamagui/linear-gradient'
import { Check, ChevronDown, ChevronUp } from '../../icons'
import { useId, useMemo, useState } from 'react'
import {
  Adapt,
  Button,
  H1,
  Image,
  Label,
  Select,
  Separator,
  Sheet,
  Text,
  View,
  debounce,
} from 'tamagui'
import { Checkboxes } from '../checkboxes/common/checkboxParts'
import { Input } from '../inputs/components/inputsParts'
import { RadioGroup } from '../radiogroups/components/radioParts'

const notifications = [
  {
    title: 'Books',
    desc: 'Get notified when new books are published',
  },
  {
    title: 'Courses',
    desc: 'Get notified when new courses are published',
  },
  {
    title: 'Events',
    desc: 'Get notified when new events are published',
  },
]

/** ------ EXAMPLE ------ */

export function SignUpTwoSideScreen() {
  const uniqueId = useId()
  const [marriageState, setMarriageState] = useState('single')

  const [values, setValues] = useState({
    Books: false,
    Courses: false,
    Events: false,
  })

  // Note: debounce is used to prevent multiple state updates that could toggle previous values
  const toggleValues = debounce((values: any) => {
    setValues((prev) => ({ ...prev, ...values }))
  }, 10)

  return (
    <View flexDirection="row" width="100%" minH="100%">
      <View flexDirection="column" shrink={1} grow={3} gap="4" px="@gtXs/window:8">
        <H1 size="9" fontWeight="bold">
          Basic Details
        </H1>
        <Separator mx="-4" />
        <View
          flexDirection="row"
          justify="space-between"
          flexWrap="wrap"
          gap="4 @gtXs/window:8"
        >
          <View
            flexDirection="column"
            gap="4"
            flex={1}
            minW="100% @gtSm/window:inherit"
            flexBasis="@gtSm/window:200px"
          >
            <View flexDirection="column" gap="1">
              <Input size="4">
                <Input.Label htmlFor={uniqueId + '1-first-name'}>First Name</Input.Label>
                <Input.Box>
                  <Input.Area id={uniqueId + '1-first-name'} placeholder="First name" />
                </Input.Box>
              </Input>
            </View>
            <View flexDirection="column" gap="1">
              <Input size="4">
                <Input.Label htmlFor={uniqueId + '1-last-name'}>Last Name</Input.Label>
                <Input.Box>
                  <Input.Area id={uniqueId + '1-last-name'} placeholder="Last name" />
                </Input.Box>
              </Input>
            </View>
            <View flexDirection="column" gap="1">
              <Input.Label htmlFor={uniqueId + '1-marital-status'}>
                Marital Status
              </Input.Label>
              <RadioGroup
                gap="8"
                flexDirection="row"
                value={marriageState}
                onValueChange={setMarriageState}
                id={uniqueId + '1-marital-status'}
              >
                <View flexDirection="row" items="center" gap="3">
                  <RadioGroup.Item id={uniqueId + 'single'} value="single">
                    <RadioGroup.Indicator
                      width="33%"
                      height="33%"
                      rounded={1000}
                      bg="color"
                    />
                  </RadioGroup.Item>

                  <Input.Label htmlFor={uniqueId + 'single'}>Single</Input.Label>
                </View>
                <View flexDirection="row" items="center" gap="3">
                  <RadioGroup.Item id={uniqueId + 'married'} value="married">
                    <RadioGroup.Indicator
                      width="33%"
                      height="33%"
                      rounded={1000}
                      bg="color"
                    />
                  </RadioGroup.Item>

                  <Input.Label htmlFor={uniqueId + 'married'}>Married</Input.Label>
                </View>
              </RadioGroup>
            </View>
            <View flexDirection="column" gap="1">
              <Input.Label htmlFor={uniqueId + 'country'}>Country</Input.Label>
              <CountrySelect data={countries} id={uniqueId + 'country'} />
            </View>
            <Input size="4">
              <Input.Label htmlFor={uniqueId + '1-city'}>City</Input.Label>
              <Input.Box>
                <Input.Area id={uniqueId + '1-city'} placeholder="City" />
              </Input.Box>
            </Input>
          </View>
          <View flexDirection="column" gap="4" flex={1} flexBasis={200}>
            <Input size="4">
              <Input.Label htmlFor={uniqueId + '1-depart'}>Department</Input.Label>
              <Input.Box>
                <Input.Area id={uniqueId + '1-depart'} placeholder="Department" />
              </Input.Box>
            </Input>
            <View flexDirection="column" gap="1">
              <Input size="4">
                <Input.Label htmlFor={uniqueId + '1-email'}>Email</Input.Label>
                <Input.Box>
                  <Input.Area
                    textContentType="emailAddress"
                    keyboardType="email-address"
                    inputMode="email"
                    id={uniqueId + '1-email'}
                    placeholder="email@example.com"
                  />
                </Input.Box>
              </Input>
            </View>
            <Checkboxes
              values={values}
              onValuesChange={(values) => toggleValues(values)}
              flexDirection="column"
              mt="3"
              gap="2-5"
            >
              <Input.Label htmlFor={uniqueId + 'single'}>
                Receive notifications
              </Input.Label>
              <Checkboxes.FocusGroup>
                <Checkboxes.Group>
                  {notifications.map((item) => {
                    const { title, desc } = item
                    return (
                      <Checkboxes.FocusGroup.Item value={title} key={title}>
                        <Checkboxes.Group.Item>
                          <Checkboxes.Card
                            flexDirection="column"
                            justify="space-between"
                            pb="3"
                            pt="-3"
                            mb={-1}
                            borderBottomWidth={1}
                            borderBottomColor="color-5"
                            key={title}
                          >
                            <View
                              flexDirection="row"
                              items="center"
                              justify="space-between"
                            >
                              <Label htmlFor={title} lineHeight={'unset'}>
                                {title}
                              </Label>
                              <Checkboxes.Checkbox id={title}>
                                <Checkboxes.Checkbox.Indicator>
                                  <Check />
                                </Checkboxes.Checkbox.Indicator>
                              </Checkboxes.Checkbox>
                            </View>
                            <Text fontSize="4" theme="level2">
                              {desc}
                            </Text>
                          </Checkboxes.Card>
                        </Checkboxes.Group.Item>
                      </Checkboxes.FocusGroup.Item>
                    )
                  })}
                </Checkboxes.Group>
              </Checkboxes.FocusGroup>
            </Checkboxes>

            <Button
              theme="accent"
              self="flex-end"
              width="12 sm:100%"
              mt="2-5 sm:4"
              mb="2 sm:6"
            >
              <Button.Text>Save</Button.Text>
            </Button>
          </View>
        </View>
      </View>
    </View>
  )
}

SignUpTwoSideScreen.fileName = 'SignUpTwoSide'

const countries = [
  { name: 'Spain', flag: 'ES' },
  { name: 'Japan', flag: 'JP' },
  { name: 'China', flag: 'CN' },
  { name: 'Korea', flag: 'KR' },
  { name: 'United States', flag: 'US' },
  { name: 'Italy', flag: 'IT' },
  { name: 'Portugal', flag: 'PT' },
  { name: 'France', flag: 'FR' },
  { name: 'Saudi Arabia', flag: 'SA' },
  { name: 'Germany', flag: 'DE' },
  { name: 'Russia', flag: 'RU' },
].map((item) => ({
  ...item,
  flag: `https://flagsapi.com/${item.flag}/flat/64.png`,
  shortName: item.flag,
}))

function CountrySelect({ data, id }: { data: typeof countries; id: string }) {
  const [val, setVal] = useState('0')

  const selectedItem = data[Number(val)]

  return (
    <Select
      id={id}
      value={val}
      onValueChange={setVal}
      disablePreventBodyScroll
      zIndex={200000}
    >
      <Select.Trigger width="100%" rounded="4">
        <View flexDirection="row" gap="3" justify="center" items="center">
          <Image src={selectedItem.flag} width={20} height={20} />
          <Text mr="auto">{`${selectedItem.name} ${
            selectedItem.shortName ? `(${selectedItem.shortName})` : ''
          }`}</Text>
        </View>
        <Select.Icon>
          <ChevronDown />
        </Select.Icon>
      </Select.Trigger>

      <Adapt when="maxMd" platform="touch">
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
          // animateOnly={['transform', 'opacity']}
          minW={200}
          borderWidth={1}
          borderColor="border-color"
          rounded="4"
        >
          <Select.Group>
            {/* for longer lists memoizing these is useful */}
            {useMemo(
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
                      <Image src={item.flag} width={20} height={20} />
                      <Text mr="auto">{`${item.name} ${
                        item.shortName ? `(${item.shortName})` : ''
                      }`}</Text>
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
