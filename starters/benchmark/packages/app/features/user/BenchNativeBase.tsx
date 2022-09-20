import {
  Box,
  Center,
  extendTheme,
  HStack,
  Image,
  NativeBaseProvider,
  Pressable,
  Text,
  VStack,
} from 'native-base'
import React from 'react'
import { Icon } from './ListIcon'

const colors = {
  light: {
    1: '#FFFFFFCC',
    2: '#FFFFFF66',
    3: '#FFFFFF3D',
    4: '#FFFFFF14',
  },
  dark: {
    1: '#000000CC',
    2: '#00000066',
    3: '#0000003D',
    4: '#00000014',
  },
  brand: {
    darkVoid: '#141416',
    blackGrey: '#23262F',
    black: '#000000',
    white: '#FFFFFF',
  },
}

const theme = extendTheme({
  colors,
  components: {
    Button: {
      variants: {
        solid: {
          height: 12,
          bg: 'brand.yellow',
          borderColor: 'brand.yellow',
          borderWidth: 0,
          _text: {
            fontSize: 'lg',
            fontWeight: 'bold',
            color: 'brand.blackGrey',
          },
        },
      },
    },
    View: {
      baseStyle: {
        flex: 1,
        bg: 'brand.darkVoid',
      },
    },
    Text: {
      baseStyle: {
        fontSize: 'sm',
        color: 'brand.white',
        fontWeight: 'medium',
      },
    },
  },
})

export function Provider({ children }) {
  return <NativeBaseProvider theme={theme}>{children}</NativeBaseProvider>
}

export const ListItem = (item: any) => {
  const { name, thumbnail, label1, label2, label3 } = item.item.values

  return (
    <Pressable bg="brand.blackGrey" borderRadius="8" my="1" onPress={() => console.log('click')}>
      <Box
        height="88"
        bg="brand.blackGrey"
        borderRadius="8"
        p="3"
        borderColor="light.4"
        borderWidth="1"
        flexDirection="row"
      >
        <Box h="16" w="16" mr="3">
          <Box
            position="absolute"
            h="16"
            w="16"
            justifyContent="center"
            alignItems="center"
            zIndex={1}
          >
            <Icon />
          </Box>
          <Image
            h="16"
            w="16"
            source={{
              uri: thumbnail,
            }}
            alt={name}
            resizeMode="cover"
            borderRadius="2"
          />
        </Box>
        <VStack flex="1" justifyContent="space-between" overflow="hidden">
          <Text fontSize="sm" fontWeight="medium" lineHeight="16px" numberOfLines={2} isTruncated>
            {name}
          </Text>
          <HStack flexDirection="row" flex="1" alignItems="flex-end">
            <Label key="label1" text={label1} />
            <Label key="label2" text={label2} />
            <Label key="label3" text={label3} />
          </HStack>
        </VStack>
        <Center>
          <Icon />
        </Center>
      </Box>
    </Pressable>
  )
}

function Label({ text }: { text: string }) {
  return (
    <HStack h={6} px={2} py={1} bg="brand.black" mr={2} borderRadius="4" alignItems="center">
      <Box mr="1">
        <Icon />
      </Box>
      <Text fontSize="xs" fontWeight="bold" lineHeight="14px" isTruncated>
        {text}
      </Text>
    </HStack>
  )
}
