import Feather from '@expo/vector-icons/Feather'
import { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { Button, Caption, List, Text, Title } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Eventful } from 'types'
import { LoadingView } from '../components/LoadingView'
import { Spacer } from '../components/Spacer'
import { getLogs } from '../libs/log'
import { getScheduledNotifications } from '../libs/notification'
import { s } from '../libs/styles'

export const DevScreen = ({}: Eventful.RN.MainStackScreenProps<'Dev'>) => {
  const [schedNotifs, setSchedNotifs] = useState<Eventful.LocalNotification[]>([])
  const [logs, setLogs] = useState('')

  const fetchEverything = async () => {
    await getScheduledNotifications().then((notifs) => setSchedNotifs(notifs))
    if (getLogs) {
      await getLogs().then((logs) => setLogs(logs ?? ''))
    }
  }

  useEffect(() => {
    fetchEverything()
  }, [])

  return (
    <LoadingView style={[s.c, s.flx_1, s.flx_c]} edges={['left', 'right', 'bottom']}>
      <Button icon={(props) => <Feather {...props} name="refresh-cw" />} onPress={fetchEverything}>
        Refresh
      </Button>
      <Spacer />
      <ScrollView style={[s.flx_c]}>
        <List.Accordion title="Scheduled Notifications">
          {!!schedNotifs.length ? (
            schedNotifs.map((sched) => (
              <List.Item
                key={sched.expo.identifier}
                title={sched.expo.identifier}
                description={JSON.stringify(sched, null, 2)}
                descriptionNumberOfLines={100}
              />
            ))
          ) : (
            <List.Item title="None" />
          )}
          <List.Item title="" />
        </List.Accordion>
        <List.Accordion title="Logs">
          <Text>{logs}</Text>
        </List.Accordion>
      </ScrollView>
    </LoadingView>
  )
}
