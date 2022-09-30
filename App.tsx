// import 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider, useSession } from './eventfulLib/session'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
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
import { c, radius } from './libs/styles'
import { ContactSelectScreen } from './screens/ContactSelect'
import { StatusBar } from 'expo-status-bar'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useEffect } from 'react'
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
import { NotificationsScreen } from './screens/NotificationsScreen'

const log = extend('APP')

moment.tz.setDefault()

const qc = new QueryClient()

const Inner = () => {
  useSession(true)
  const { show } = useSnackbar()
  useReminderScheduler()
  const url = useURL()

  const navigation = useNavigation<Eventful.RN.RootStackScreenProps<'Main'>['navigation']>()

  useEffect(() => {
    if (url) {
      const { queryParams } = parse(url)
      if (queryParams) {
        log.info('deep link', url, queryParams)
        const { eventId, userId } = queryParams as { eventId?: Eventful.ID; userId?: Eventful.ID }
        if (eventId) {
          navigation.navigate('Main', {
            screen: 'EventTab',
            params: { screen: 'Event', params: { event: eventId } },
          })
        }
        if (userId) {
          navigation.navigate('Main', {
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
const MainStack = createNativeStackNavigator()

const MainNav = () => {
  const { session } = useSession()

  return (
    <MainStack.Navigator
      initialRouteName="Events"
      screenOptions={{
        headerTitle: '',
      }}
    >
      <MainStack.Screen name="Events" component={EventsScreen} />
      <MainStack.Screen name="Event" component={EventScreen} />
      <MainStack.Screen name="ContactSelect" component={ContactSelectScreen} />
      <MainStack.Screen name="PlanEdit" component={PlanEditScreen} />
      <MainStack.Screen name="EventSetting" component={EventSettingScreen} />
      <MainStack.Screen name="NotificationSetting" component={NotificationSettingScreen} />
      <MainStack.Screen name="Notifications" component={NotificationsScreen} />
      <MainStack.Screen name="User" component={UserScreen} initialParams={{ user: session?._id }} />
      <MainStack.Screen name="Tag" component={TagScreen} />
      <MainStack.Screen
        name="UserSearch"
        component={UserSearchScreen}
        options={{ title: 'Search for people' }}
      />
      {/* <MainStack.Screen name='UserSetting' component={} /> */}
      <MainStack.Screen name="ReminderEdit" component={ReminderEditScreen} />
      <MainStack.Screen name="Contacts" component={ContactsScreen} />
      <MainStack.Screen name="Tags" component={TagsScreen} />
      <MainStack.Screen name="Dev" component={DevScreen} options={{ title: 'WTF is going on' }} />
      {/* <MainStack.Screen name='Map' component={} />
      <MainStack.Screen name='Pings' component={} /> */}
    </MainStack.Navigator>
  )
}

const Nav = () => {
  return (
    <WelcomeStack.Navigator>
      <WelcomeStack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <WelcomeStack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
      <WelcomeStack.Screen name="Main" component={MainNav} options={{ headerShown: false }} />
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
