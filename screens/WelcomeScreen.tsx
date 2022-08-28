import { useEffect } from 'react'
import { Text, View } from 'react-native'
import { Eventful } from 'types'
import { Button } from '../components/Button'
import { useSession } from '../eventfulLib/session'
import { s } from '../libs/styles'

export const WelcomeScreen = ({ navigation }: Eventful.RN.RootStackScreenProps<'Welcome'>) => {
  const { session } = useSession()

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [])

  useEffect(() => {
    if (session) {
      navigation.replace('App', { screen: 'AgendaTab', params: { screen: 'Events' } })
    }
  }, [session])

  return (
    <View style={[s.c, s.flx_1, s.aic, s.jcc]}>
      <View style={[{ height: '25%' }, s.jcsb]}>
        <View style={{ paddingVertical: 10 }}>
          <Text style={[s.h1]}>Eventful</Text>
          <Text style={[s.h5]}>(You need to log in)</Text>
        </View>
        <Button title="Log in" onPress={() => navigation.navigate('Auth')} mode="outlined" />
      </View>
    </View>
  )
}
