import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider, useSession } from './eventfulLib/session'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { EventsScreen } from './screens/EventsScreen'
import { Eventful } from 'types'
import { AuthScreen } from './screens/AuthScreen'
import { WelcomeScreen } from './screens/WelcomeScreen'
import { UserScreen } from './screens/UserScreen'
import { ContactsScreen } from './screens/ContactsScreen'

const qc = new QueryClient()

const Inner = () => {
  useSession(true)
  return null
}

const Stack = createNativeStackNavigator<Eventful.RN.RootStackParamList>()

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <SessionProvider>
        <Inner />
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerStyle: { backgroundColor: DefaultTheme.colors.background },
                headerShadowVisible: false,
              }}
            >
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="Events" component={EventsScreen} />
              <Stack.Screen name="Auth" component={AuthScreen} />
              <Stack.Screen name="User" component={UserScreen} />
              <Stack.Screen name="Contacts" component={ContactsScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </SessionProvider>
    </QueryClientProvider>
  )
}
