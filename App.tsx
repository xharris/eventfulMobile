// import 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider, useSession } from './eventfulLib/session'
import { DefaultTheme, NavigationContainer, useNavigation } from '@react-navigation/native'
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
import { c, radius, useAnimatedValue } from './libs/styles'
import { ContactSelectScreen } from './screens/ContactSelect'
import { StatusBar } from 'expo-status-bar'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Animated, View } from 'react-native'
import { useStorage } from './libs/storage'
import Feather from '@expo/vector-icons/Feather'
import { ComponentProps, useEffect, useRef } from 'react'
import { UserSearchScreen } from './screens/UserSearchScreen'
import { SnackbarProvider, useSnackbar } from './components/Snackbar'
import { api } from './eventfulLib/api'
import ERROR from './eventfulLib/error'
import { MapScreen } from './screens/MapScreen'
import { PingsScreen } from './screens/PingsScreen'
import { ReminderEditScreen } from './screens/ReminderEditScreen'
import moment from 'moment-timezone'
import { useReminderScheduler } from './eventfulLib/reminder'
import { DevScreen } from './screens/DevScreen'
import { extend } from './eventfulLib/log'
import { parse, useURL } from 'expo-linking'
import { EventSettingScreen } from './screens/EventSettingScreen'
import { TagScreen } from './screens/TagScreen'
import { TagsScreen } from './screens/TagsScreen'

const log = extend('APP')

moment.tz.setDefault()

const qc = new QueryClient()

const Inner = () => {
  useSession(true)
  const { show } = useSnackbar()
  useReminderScheduler()
  const url = useURL()

  const navigation = useNavigation<Eventful.RN.RootStackScreenProps<'App'>['navigation']>()

  useEffect(() => {
    if (url) {
      const { queryParams } = parse(url)
      if (queryParams) {
        log.info('deep link', url, queryParams)
        const { eventId, userId } = queryParams as { eventId?: Eventful.ID; userId?: Eventful.ID }
        if (eventId) {
          navigation.navigate('App', {
            screen: 'EventTab',
            params: { screen: 'Event', params: { event: eventId } },
          })
        }
        if (userId) {
          navigation.navigate('App', {
            screen: 'UserTab',
            params: { screen: 'User', params: { user: userId } },
          })
        }
      }
    }
  }, [url, navigation])

  useEffect(() => {
    const ic = api.interceptors.response.use(
      (res) => res,
      (err) => {
        const code = err.response.status
        const status = err.response.data ?? err.code
        log.error(`[API] code=${code} text=${status}`)
        if (code === 503) {
          show({
            text: 'Server unavailable',
          })
        } else if (code >= 400 && code !== 401 && status) {
          show({
            text: status in ERROR ? ERROR[status] : status,
          })
        }
        return Promise.reject(err)
      }
    )

    return () => {
      api.interceptors.response.eject(ic)
    }
  }, [])

  return <StatusBar style="dark" />
}

const WelcomeStack = createNativeStackNavigator()
const MapStack = createNativeStackNavigator()
const PingsStack = createNativeStackNavigator()
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
  const [storage] = useStorage()
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
      {/* <BottomTabs.Screen
        name="MapTab"
        options={{
          title: 'Map',
          tabBarColor: '#1A237E',
          tabBarIcon: (props) => <TabIcon {...props} name="map" />,
        }}
      >
        {() => (
          <MapStack.Navigator>
            <MapStack.Screen name="Map" component={MapScreen} />
          </MapStack.Navigator>
        )}
      </BottomTabs.Screen> */}
      {/* <BottomTabs.Screen
        name="PingsTab"
        options={{
          title: 'Pings',
          tabBarColor: '#0D47A1',
          tabBarIcon: (props) => <TabIcon {...props} name="map-pin" />,
        }}
      >
        {() => (
          <PingsStack.Navigator>
            <PingsStack.Screen name="Pings" component={PingsScreen} />
          </PingsStack.Navigator>
        )}
      </BottomTabs.Screen> */}
      <BottomTabs.Screen
        name="EventTab"
        options={{
          title: 'Event',
          tabBarColor: '#0D47A1',
          tabBarIcon: (props) =>
            !!storage?.lastEvent ? <TabIcon {...props} name="align-left" /> : null,
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
            <EventStack.Screen name="EventSetting" component={EventSettingScreen} />
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
            <UserStack.Screen name="ReminderEdit" component={ReminderEditScreen} />
            <UserStack.Screen
              name="UserSearch"
              component={UserSearchScreen}
              options={{ title: 'Search for people' }}
            />
            <UserStack.Screen
              name="Dev"
              component={DevScreen}
              options={{ title: 'WTF is going on' }}
            />
            <UserStack.Screen name="Tag" component={TagScreen} />
            <UserStack.Screen name="Tags" component={TagsScreen} />
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
    <QueryClientProvider client={qc}>
      <Provider
        theme={{
          ...DefaultPaperTheme,
          roundness: radius.normal,
          colors: {
            ...DefaultPaperTheme.colors,
            primary: c.oneDark,
            accent: c.twoDark,
            background: '#ECEFF1', // , c.bg,
            surface: c.surf,
            text: c.onBg,
            onSurface: c.onSurf,
            error: c.err,
          },
        }}
      >
        <SessionProvider>
          <SnackbarProvider>
            <SafeAreaProvider>
              <NavigationContainer>
                <Inner />
                <Nav />
              </NavigationContainer>
            </SafeAreaProvider>
          </SnackbarProvider>
        </SessionProvider>
      </Provider>
    </QueryClientProvider>
  )
}
