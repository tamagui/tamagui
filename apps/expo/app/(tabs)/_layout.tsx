import { Avatar, Circle, Theme, YStack, useThemeName } from '@my/ui'
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import { LinearGradient } from '@tamagui/linear-gradient'
import { Home, Plus } from '@tamagui/lucide-icons'
import { useUser } from 'app/utils/useUser'
import { Stack, Tabs } from 'expo-router'
import { SolitoImage } from 'solito/image'
import { useRouter } from 'solito/router'

export default function Layout() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Tabs screenOptions={{ headerShown: false, tabBarShowLabel: false }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ size, color }) => <Home color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="_create"
          listeners={({ navigation }) => ({
            tabPress: (event) => {
              event.preventDefault()
              navigation.navigate('create')
            },
          })}
          options={{
            title: 'New',
            tabBarIcon: PlusButton,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ProfileTabIcon,
          }}
        />
      </Tabs>
    </>
  )
}

type TabBarIconProps = Parameters<Exclude<BottomTabNavigationOptions['tabBarIcon'], undefined>>[0]

const ProfileTabIcon = ({ color, size }: TabBarIconProps) => {
  const { avatarUrl } = useUser()
  return (
    <YStack borderWidth="$1" borderColor={color} borderRadius="$10">
      <Avatar circular p="$1" size={size}>
        <SolitoImage src={avatarUrl} alt="your avatar" width={size} height={size} />
      </Avatar>
    </YStack>
  )
}

const PlusButton = ({ size }: TabBarIconProps) => {
  const router = useRouter()
  const theme = useThemeName()
  const isDark = theme.startsWith('dark')

  return (
    <Theme inverse>
      <Circle
        pos="absolute"
        bottom={5}
        backgroundColor="$color1"
        shadowColor="black"
        shadowOpacity={isDark ? 0.7 : 1}
        shadowRadius={isDark ? 3 : 10}
        shadowOffset={{
          height: 0,
          width: 5,
        }}
        width={size + 34}
        height={size + 34}
      />
      <LinearGradient
        onPress={() => router.push('/create')}
        colors={['$gray6', '$gray7']}
        start={[1, 1]}
        end={[0.8, 0]}
        width={size + 34}
        height={size + 34}
        borderRadius="$10"
        pos="absolute"
        bottom={5}
        pressStyle={{
          rotate: '20deg',
        }}
      />
      <YStack
        pos="absolute"
        bottom={5}
        jc="center"
        ai="center"
        animation="quick"
        pointerEvents="none"
        height={size + 34}
      >
        <Plus color="$color" size={size + 20} />
      </YStack>
    </Theme>
  )
}
