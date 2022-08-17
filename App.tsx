import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider, useSession } from './eventfulLib/session'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { EventsScreen } from './screens/EventsScreen'
import { Eventful } from 'types'
import { AuthScreen } from './screens/AuthScreen'
import { WelcomeScreen } from './screens/WelcomeScreen'

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
            <Stack.Navigator>
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="Events" component={EventsScreen} />
              <Stack.Screen name="Auth" component={AuthScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </SessionProvider>
    </QueryClientProvider>
  )
}
