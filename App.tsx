// import 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider, useSession } from './eventfulLib/session'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { EventsScreen } from './screens/EventsScreen'
import { Eventful } from 'types'
import { Provider, DefaultTheme as DefaultPaperTheme } from 'react-native-paper'
import { AuthScreen } from './screens/AuthScreen'
import { WelcomeScreen } from './screens/WelcomeScreen'
import { UserScreen } from './screens/UserScreen'
import { ContactsScreen } from './screens/ContactsScreen'
import { EventScreen } from './screens/EventScreen'
import { NotificationSettingScreen } from './screens/NotificationSettingScreen'
import { PlanEditScreen } from './screens/PlanEditScreen'
import { c, useAnimatedValue } from './libs/styles'
import { ContactSelectScreen } from './screens/ContactSelect'
import { StatusBar } from 'expo-status-bar'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Animated, View } from 'react-native'
import { useStorage } from './libs/storage'
import Feather from '@expo/vector-icons/Feather'
import { ComponentProps, useRef } from 'react'
import { UserSearchScreen } from './screens/UserSearchScreen'

const qc = new QueryClient()

const Inner = () => {
  useSession(true)
  return <StatusBar style="dark" />
}

const WelcomeStack = createNativeStackNavigator()
const AgendaStack = createNativeStackNavigator()
const EventStack = createNativeStackNavigator()
const UserStack = createNativeStackNavigator()
const BottomTabs = createMaterialBottomTabNavigator()

// const DrawerNav = () => (

// )

const TabIcon = ({
  name,
  focused,
  color,
}: {
  name: ComponentProps<typeof Feather>['name']
  focused: boolean
  color: string
}) => {
  // const size = useAnimatedValue(focused ? 14 : 18, focused ? 18 : 14)

  return <Feather style={{ color }} name={name} size={18} />
}

const AppNav = () => {
  const [storage, store] = useStorage()
  const { session } = useSession()

  return (
    <BottomTabs.Navigator initialRouteName="AgendaTab" shifting={true}>
      <BottomTabs.Screen
        name="AgendaTab"
        options={{
          title: 'Agenda',
          tabBarColor: '#1A237E',
          tabBarIcon: (props) => <TabIcon {...props} name="calendar" />,
        }}
      >
        {() => (
          <AgendaStack.Navigator>
            <AgendaStack.Screen name="Events" component={EventsScreen} />
          </AgendaStack.Navigator>
        )}
      </BottomTabs.Screen>
      <BottomTabs.Screen
        name="EventTab"
        options={{
          title: 'Event',
          tabBarColor: '#0D47A1',
          tabBarIcon: (props) => <TabIcon {...props} name="align-left" />,
        }}
        listeners={{
          tabPress: (e) => {
            if (!storage?.lastEvent) {
              e.preventDefault()
            }
          },
        }}
      >
        {() => (
          <EventStack.Navigator>
            <EventStack.Screen
              name="Event"
              component={EventScreen}
              initialParams={{ event: storage?.lastEvent }}
            />
            <EventStack.Screen name="PlanEdit" component={PlanEditScreen} />
            <EventStack.Screen name="ContactSelect" component={ContactSelectScreen} />
            <EventStack.Screen name="NotificationSetting" component={NotificationSettingScreen} />
          </EventStack.Navigator>
        )}
      </BottomTabs.Screen>
      <BottomTabs.Screen
        name="UserTab"
        options={{
          title: 'User',
          tabBarColor: '#006064',
          tabBarIcon: (props) => <TabIcon {...props} name="user" />,
        }}
      >
        {() => (
          <UserStack.Navigator>
            <UserStack.Screen
              name="User"
              component={UserScreen}
              initialParams={{ user: session?._id }}
            />
            <UserStack.Screen name="Contacts" component={ContactsScreen} />
            <UserStack.Screen
              name="UserSearch"
              component={UserSearchScreen}
              options={{ title: 'Search for people' }}
            />
          </UserStack.Navigator>
        )}
      </BottomTabs.Screen>
    </BottomTabs.Navigator>
  )
}

const Nav = () => {
  return (
    <WelcomeStack.Navigator screenOptions={{ headerShown: false }}>
      <WelcomeStack.Screen name="Welcome" component={WelcomeScreen} />
      <WelcomeStack.Screen name="Auth" component={AuthScreen} />
      <WelcomeStack.Screen name="App" component={AppNav} />
    </WelcomeStack.Navigator>
  )
}

export default function App() {
  return (
    <Provider
      theme={{
        ...DefaultPaperTheme,
        colors: {
          ...DefaultPaperTheme.colors,
          primary: c.oneDark,
          accent: c.twoDark,
          background: c.bg,
          surface: c.surf,
          text: c.onBg,
          onSurface: c.onSurf,
        },
      }}
    >
      <QueryClientProvider client={qc}>
        <SessionProvider>
          <Inner />
          <SafeAreaProvider>
            <NavigationContainer>
              <Nav />
            </NavigationContainer>
          </SafeAreaProvider>
        </SessionProvider>
      </QueryClientProvider>
    </Provider>
  )
}
