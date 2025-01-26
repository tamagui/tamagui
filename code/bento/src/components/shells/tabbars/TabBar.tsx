import { useState } from 'react'
import { Button, View, isWeb, Text } from 'tamagui'
import { usePhoneScale } from '../../general/_Showcase'

type CustomTabBarProps = {
  state: {
    index: number
    routes: { name: string; key: string }[]
  }
  descriptors: {
    [key: string]: {
      options: {
        tabBarLabel?: string
        title?: string
      }
    }
  }
  navigation: {
    // Note: use types from react-navigation in your code
    navigate?: any
    emit?: any
  }
}

const CustomTabBar = View.styleable<CustomTabBarProps>(
  ({ state, descriptors, navigation, ...rest }, ref) => {
    const [tabWidth, setTabWidth] = useState(100)
    const [hoveredIndex, setHoveredIndex] = useState(state.index)
    // Note: you should remove the following line in your code
    const { scale } = usePhoneScale()
    return (
      <View
        flexDirection="row"
        maxWidth="100%"
        onLayout={(e) => {
          const width = e.nativeEvent.layout.width
          // Note: you should remove the following line in your code
          const scaledWidth = width + width * (1 - scale)
          // Note: use width instead of scaledWidth in your code
          setTabWidth(scaledWidth / state.routes.length)
        }}
        {...rest}
        ref={ref}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name

          const isFocused = state.index === index

          const onPress = () => {
            if (!isWeb) {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              })

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name)
              }
            } else {
              // navigate to the route using nextjs router
              navigation.navigate(route.name)
            }
          }

          return (
            <Button
              unstyled
              flex={1}
              width={100}
              height={50}
              flexShrink={1}
              justifyContent="center"
              alignItems="center"
              cursor="pointer"
              key={index}
              onPress={onPress}
              {...(isWeb && {
                onMouseEnter: () => {
                  setHoveredIndex(index)
                },
                onMouseLeave: () => {
                  setHoveredIndex(state.index)
                },
              })}
            >
              <Text color={isFocused ? '$color10' : '$gray10Light'}>{label}</Text>
            </Button>
          )
        })}
        <View
          bottom={0}
          left={0}
          borderWidth={3}
          width={tabWidth}
          borderColor="$color5"
          x={hoveredIndex * tabWidth}
          animation="100ms"
          position="absolute"
        />
        <View
          bottom={0}
          left={0}
          borderWidth={3}
          width={tabWidth}
          borderColor="$color10"
          x={state.index * tabWidth}
          animation="quick"
          position="absolute"
        />
      </View>
    )
  }
)

/** ------ EXAMPLE ------ */
export function Tabbar() {
  // const router = useRouter();
  // get the current route index

  // uncomment the commented code if you are using with nextjs
  const currentRouteIndex = 0 // router.routes.findIndex((route) => route.name === router.route);

  // don't use state in your app, just use plain object
  const [state, setState] = useState({
    // index is the index of active tab
    index: currentRouteIndex,
    routes: [
      { name: '/', key: 'Home' },
      { name: '/about', key: 'About' },
      { name: '/contact', key: 'Contact' },
      // Add other routes as needed
    ],
  })

  const descriptors = {
    Home: { options: { title: 'Home' } },
    About: { options: { title: 'About' } },
    Contact: { options: { title: 'Contact' } },
    // Add other descriptors as needed
  }

  return (
    <View
      flexDirection="column"
      width="100%"
      minHeight={610}
      height="100%"
      maxHeight="100%"
    >
      <View
        flexDirection="column"
        width="100%"
        flex={9}
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize="$8" fontWeight="$8" lineHeight="$8">
          {state.routes[state.index].key}
        </Text>
      </View>
      <CustomTabBar
        theme="red"
        alignSelf="center"
        state={state}
        descriptors={descriptors}
        navigation={{
          navigate: (route: string) => {
            // navigate to the route using nextjs router
            // umcomment the commented code if you are using with nextjs
            // router.push(route);
            // remove the following line in your code
            setState((prevState) => ({
              ...prevState,
              index: prevState.routes.findIndex((r) => r.name === route),
            }))
          },
        }}
      />
    </View>
  )
}

Tabbar.fileName = 'TabBar'

/**
 * on native we need to use it with react-navigation
 * to use with react-navigation use the following code
 *
 */
// import { NavigationContainer } from 'react-navigation/native';
// import { createBottomTabNavigator } from 'react-navigation/bottom-tabs';

// const Tab = createBottomTabNavigator();

// const Home = () => <div>Home Screen</div>;
// const About = () => <div>About Screen</div>;

// const App = () => {
//   return (
//     <NavigationContainer>
//       <Tab.Navigator
//         tabBar={(props) => <CustomTabBar {...props} />}
//       >
//         <Tab.Screen name="Home" component={Home} />
//         <Tab.Screen name="About" component={About} />
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// };
