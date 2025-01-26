import { Globe2, Search, X } from '@tamagui/lucide-icons'
import type { SizeTokens } from 'tamagui'
import {
  Adapt,
  Avatar,
  Image,
  Popover,
  ScrollView,
  Spinner,
  Text,
  View,
  isWeb,
} from 'tamagui'
import { Input } from './components/inputsParts'
import { useState, useMemo, useEffect } from 'react'
import {
  getSupportedRegionCodes,
  parsePhoneNumber,
  getCountryCodeForRegionCode,
} from 'awesome-phonenumber'
import { RovingFocusGroup } from '@tamagui/roving-focus'

/**
 * in case you want to integrate it with zod validation, following snippet can be used
 *
 *   const isPhoneNumber = (ph: string) => parsePhoneNumber(ph)?.valid;
 *   const phoneNumberSchema = z.string().refine(isPhoneNumber, (val) => ({message: `${val} is not a valid phone number`}));
 *   const MySchema = z.object({ phone_number: phoneNumberSchema })
 *
 **/

interface PhoneCode {
  name: string
  flag: string
}

const phoneCodes: PhoneCode[] = getSupportedRegionCodes().map((code) => {
  return {
    name: code,
    flag: `https://flagsapi.com/${code}/flat/64.png`,
  }
})

type RegionFilterInputProps = {
  setRegionCode: (regionCode: string) => void
  setOpen: (open: boolean) => void
  open: boolean
}

function RegionFilterInput(props: RegionFilterInputProps) {
  const { setRegionCode, setOpen, open } = props
  const [filter, setFilter] = useState('')
  const [reset, setReset] = useState(0)

  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let timeoutId
    if (open) {
      timeoutId = setTimeout(() => {
        setLoaded(true)
      }, 200)
    } else setLoaded(false)
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [open])

  const phoneCodesFiltered = useMemo(() => {
    return phoneCodes.filter((item) => {
      return item.name.toLowerCase().includes(filter.toLowerCase())
    })
  }, [filter])

  return (
    <RovingFocusGroup
      flexDirection="column"
      gap="$3"
      paddingTop="$4"
      height="100%"
      width="100%"
      backgroundColor="$gray1"
    >
      <Input marginHorizontal="$3" size="$2">
        <Input.Box>
          <Input.Area
            // Note: when key changes, the input remounts and the value will be reset
            // we can achive better performance using this approach instead binding the value to state
            key={reset}
            width="100%"
            borderRadius={0}
            placeholder="Search"
            defaultValue={filter}
            onChangeText={setFilter}
          />
          <Input.Icon
            onPress={() => {
              setFilter('')
              setReset(reset === 0 ? 1 : 0)
            }}
            pointerEvents="auto"
            zIndex={10}
            theme="alt1"
          >
            {filter ? <X /> : <Search />}
          </Input.Icon>
        </Input.Box>
      </Input>

      {open && (
        <ScrollView height="100%" justifyContent={loaded ? 'flex-start' : 'center'}>
          {loaded ? (
            <>
              {phoneCodesFiltered.map((item) => {
                return (
                  <RovingFocusGroup.Item
                    key={item.name}
                    {...(isWeb && {
                      onKeyDown: (e: KeyboardEvent) => {
                        if (e.key === 'Enter') {
                          setRegionCode(item.name)
                          setOpen(false)
                        }
                      },
                    })}
                    focusStyle={{
                      outlineColor: '$outlineColor',
                      outlineOffset: -2,
                    }}
                  >
                    <View
                      group="item"
                      flexDirection="row"
                      alignItems="center"
                      gap="$3"
                      paddingHorizontal="$4"
                      paddingVertical="$2"
                      borderWidth={0}
                      borderBottomWidth={1}
                      borderColor="$borderColor"
                      cursor="pointer"
                      hoverStyle={{
                        backgroundColor: '$gray2',
                      }}
                      focusStyle={{
                        backgroundColor: '$gray2',
                      }}
                      onPress={() => {
                        setRegionCode(item.name)
                        setOpen(false)
                      }}
                    >
                      <Avatar size="$1.5" br={5}>
                        <Avatar.Image
                          accessibilityLabel="Profile image"
                          src={item.flag}
                        />
                        <Avatar.Fallback backgroundColor="$color5" />
                      </Avatar>
                      <Text
                        color="$gray10"
                        $group-item-hover={{
                          color: '$gray12',
                        }}
                        marginRight="auto"
                      >
                        {item.name}
                      </Text>
                    </View>
                  </RovingFocusGroup.Item>
                )
              })}
            </>
          ) : (
            <Spinner size="large" />
          )}
        </ScrollView>
      )}
    </RovingFocusGroup>
  )
}

type RegionSelectBoxProps = {
  regionCode: string
  setRegionCode: (regionCode: string) => void
  containerWidth?: number
}

function RegionSelectBox(props: RegionSelectBoxProps) {
  const { regionCode, setRegionCode, containerWidth } = props

  const [open, setOpen] = useState(false)

  const selectedItem = useMemo(
    () => phoneCodes.find((item) => item.name === regionCode)!,
    [regionCode]
  )

  return (
    <Popover
      offset={{
        mainAxis: 5,
      }}
      open={open}
      onOpenChange={setOpen}
      allowFlip
      placement="bottom-start"
      keepChildrenMounted
      {...props}
    >
      <Popover.Trigger>
        <Input.XGroup.Item>
          <Input.Button paddingHorizontal="$2" onPress={() => setOpen(true)}>
            {regionCode ? (
              <>
                <Image source={{ uri: selectedItem.flag }} width={20} height={20} />
              </>
            ) : (
              <>
                <Globe2 color="$gray10" width={20} height={20} />
              </>
            )}
          </Input.Button>
        </Input.XGroup.Item>
      </Popover.Trigger>

      <Adapt when="sm" platform="touch">
        <Popover.Sheet modal dismissOnSnapToBottom>
          <Popover.Sheet.Frame padding="$4">
            <Adapt.Contents />
          </Popover.Sheet.Frame>
          <Popover.Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Popover.Sheet>
      </Adapt>

      <Popover.Content
        width={containerWidth}
        borderWidth={1}
        height={300}
        borderColor="$borderColor"
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        elevate
        animation={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
        padding={0}
      >
        <RegionFilterInput open={open} setOpen={setOpen} setRegionCode={setRegionCode} />
      </Popover.Content>
    </Popover>
  )
}

/** ------ EXAMPLE ------ **/
export function PhoneInputExample({ size }: { size?: SizeTokens }) {
  const [regionCode, setRegionCode] = useState('US')
  const [phoneNumber, setPhoneNumber] = useState('+1')
  const [isValid, setIsValid] = useState(false)
  const [containerWidth, setContainerWidth] = useState<number>()

  useEffect(() => {
    if (regionCode) {
      setPhoneNumber('+' + getCountryCodeForRegionCode(regionCode) + ' ')
    }
  }, [regionCode])

  const handlePhoneNumberChange = (text: string) => {
    text = !phoneNumber && text !== '+' ? `+${text}` : text
    const parsed = parsePhoneNumber(text)
    // Note: parsed object has a lot of info about the number
    if (parsed.regionCode) {
      setRegionCode(parsed.regionCode)
    } else {
      setRegionCode('')
    }
    setPhoneNumber(parsed.number?.international || text)
    setIsValid(parsed.valid)
  }
  return (
    <View flexDirection="column" height={100}>
      <Input size={size} gapScale={0.5}>
        <Input.Box
          onLayout={(e) => {
            setContainerWidth(e.nativeEvent.layout.width)
          }}
          alignSelf="center"
          theme={isValid ? 'green' : undefined}
        >
          <Input.Section>
            <RegionSelectBox
              containerWidth={containerWidth}
              regionCode={regionCode}
              setRegionCode={setRegionCode}
            />
          </Input.Section>
          <Input.Section>
            <Input.Area
              keyboardType="numeric"
              value={phoneNumber}
              onChangeText={handlePhoneNumberChange}
              placeholder="Copy this text"
            />
          </Input.Section>
        </Input.Box>
      </Input>
    </View>
  )
}

PhoneInputExample.fileName = 'PhoneInput'
