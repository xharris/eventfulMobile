import Feather from '@expo/vector-icons/Feather'
import React, { useEffect, useState } from 'react'
import { Pressable, PressableProps, View } from 'react-native'
import { FAB, Portal } from 'react-native-paper'
import { Eventful } from 'types'
import { Avatar, AvatarGroup } from '../components/Avatar'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { H5 } from '../components/Header'
import { Modal } from '../components/Modal'
import { Spacer } from '../components/Spacer'
import { TextInput } from '../components/TextInput'
import { Time } from '../components/Time'
import { useEvents } from '../eventfulLib/event'
import { useSession } from '../eventfulLib/session'
import { Agenda } from '../features/Agenda'
import { s } from '../libs/styles'

const Event = ({
  event,
  onPress,
}: {
  event: Eventful.API.EventGet
  onPress: PressableProps['onPress']
}) => (
  <Card
    shadowProps={{
      style: [s.ass],
    }}
    style={[s.flx_r, s.jcsb, s.aic]}
    onPress={onPress}
  >
    <View style={[s.flx_c]}>
      <H5 style={[s.bold]}>{event.name}</H5>
      <Time time={event.time} />
    </View>
    <AvatarGroup
      avatars={event.who.map((user) => ({
        username: user.username,
      }))}
    />
  </Card>
)

export const EventsScreen = ({ navigation }: Eventful.RN.AgendaStackScreenProps<'Events'>) => {
  const { session } = useSession()
  const { data: events, createEvent, refetch, isRefetching } = useEvents()
  const [addEventModal, showAddEventModal] = useState(false)
  const [newEventText, setNewEventText] = useState('')

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerTitle: '',
      headerRight: () => (
        <Pressable
          onPress={() =>
            navigation.navigate('UserTab', {
              screen: 'User',
              params: { user: session?._id },
            })
          }
        >
          <Avatar size="medium" username={session?.username} />
        </Pressable>
      ),
    })
  }, [])

  return (
    <Portal.Host>
      <View style={[s.c]}>
        <Agenda
          items={events}
          noTimeHeader="TBD"
          renderItem={(event) => (
            <Event
              event={event}
              onPress={() =>
                navigation.navigate('App', {
                  screen: 'EventTab',
                  params: {
                    screen: 'Event',
                    params: { event: event._id },
                  },
                })
              }
            />
          )}
          renderOnEveryDay={false}
          refreshing={isRefetching}
          onRefresh={() => refetch()}
        />
        <Portal>
          <FAB
            style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
            icon={(props) => <Feather {...props} name="plus" />}
            onPress={() => showAddEventModal(true)}
          />
        </Portal>
        <Modal visible={addEventModal} onDismiss={() => showAddEventModal(false)}>
          <TextInput
            label="New event name"
            value={newEventText}
            onChangeText={(v) => setNewEventText(v)}
          />
          <Spacer />
          <View style={[s.flx_r, s.asfe]}>
            <Button title="Cancel" onPress={() => showAddEventModal(false)} />
            <Spacer />
            <Button
              title="Create"
              disabled={!newEventText.length}
              onPress={() => {
                showAddEventModal(false)
                createEvent({ name: newEventText }).then((res) =>
                  navigation.navigate('EventTab', {
                    screen: 'Event',
                    params: { event: res.data._id },
                  })
                )
              }}
            />
          </View>
        </Modal>
      </View>
    </Portal.Host>
  )
}
