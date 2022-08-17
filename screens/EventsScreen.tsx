import { DefaultTheme } from '@react-navigation/native'
import { useEffect } from 'react'
import { Text, View } from 'react-native'
import { Eventful } from 'types'
import { useEvents } from '../eventfulLib/event'
import { useSession } from '../eventfulLib/session'
import { Agenda } from '../features/Agenda'
import { s } from '../libs/styles'

const Event = ({ event }: { event: Eventful.API.EventGet }) => (
  <View>
    <Text>{event.name}</Text>
  </View>
)

export const EventsScreen = ({ navigation }: Eventful.RN.StackProps<'Events'>) => {
  const { session } = useSession()
  const { data: events } = useEvents()

  useEffect(() => {
    navigation.setOptions({
      title: 'Agenda',
      headerStyle: { backgroundColor: DefaultTheme.colors.background },
      headerShadowVisible: false,
      headerLeft: () => null,
    })
  }, [])

  return (
    <View style={[s.c]}>
      <Agenda items={events} noTimeHeader="TBD" renderItem={(event) => <Event event={event} />} />
    </View>
  )
}
