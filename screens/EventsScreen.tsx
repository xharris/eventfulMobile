import Feather from '@expo/vector-icons/Feather'
import React, { useEffect, useState } from 'react'
import { Pressable, PressableProps, View } from 'react-native'
import { FAB, IconButton, Portal } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
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
import { c, radius, s } from '../libs/styles'

const Event = ({
  event,
  onPress,
}: {
  event: Eventful.API.EventGet
  onPress: PressableProps['onPress']
}) => (
  <Pressable
    // shadowProps={{
    //   style: [s.ass],
    // }}
    android_ripple={{
      color: c.oneDark,
    }}
    style={[
      s.flx_r,
      s.jcsb,
      s.aic,
      {
        borderRadius: radius.normal,
      },
    ]}
    onPress={onPress}
  >
    <View style={[s.flx_c]}>
      <H5 style={[s.bold]}>{event.name.length > 0 ? event.name : '(Untitled event)'}</H5>
      <Time time={event.time} />
    </View>
    <AvatarGroup
      avatars={event.who.map((user) => ({
        username: user.username,
      }))}
    />
  </Pressable>
)

export const EventsScreen = ({ navigation }: Eventful.RN.AgendaStackScreenProps<'Events'>) => {
  const { session } = useSession()
  const { data: events, createEvent, refetch, isRefetching } = useEvents()
  const [newEventText, setNewEventText] = useState('')

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [navigation])

  return (
    <SafeAreaView style={[s.c, { flex: 1, backgroundColor: c.bg }]}>
      <View style={[s.flx_r, s.aic]}>
        <TextInput
          style={[s.flx_1]}
          placeholder="What are you planning?"
          value={newEventText}
          onChangeText={(v) => setNewEventText(v)}
          mode="outlined"
          outlineColor="transparent"
          dense
        />
        <IconButton
          icon={(props) => <Feather {...props} name="plus" />}
          disabled={!newEventText.length}
          onPress={() => {
            createEvent({ name: newEventText }).then((res) => {
              setNewEventText('')
              navigation.navigate('EventTab', {
                screen: 'Event',
                params: { event: res.data._id },
              })
            })
          }}
          size={25}
          style={{ marginTop: 12 }}
        />
      </View>
      <Spacer />
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
        refreshing={isRefetching}
        onRefresh={() => refetch()}
      />
    </SafeAreaView>
  )
}
