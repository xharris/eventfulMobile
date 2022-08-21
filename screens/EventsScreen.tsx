import { DefaultTheme } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { Pressable, PressableProps, Text, View } from 'react-native'
import { Eventful } from 'types'
import { Avatar, AvatarGroup } from '../components/Avatar'
import { Card } from '../components/Card'
import { H5, H6 } from '../components/Header'
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

export const EventsScreen = ({ navigation }: Eventful.RN.StackProps<'Events'>) => {
  const { session } = useSession()
  const { data: events } = useEvents()

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerTitle: '',
      headerRight: () => (
        <Pressable onPress={() => navigation.push('User', { user: session?._id })}>
          <Avatar size="medium" username={session?.username} />
        </Pressable>
      ),
    })
  }, [])

  return (
    <View style={[s.c]}>
      <Agenda
        items={events}
        noTimeHeader="TBD"
        renderItem={(event) => (
          <Event event={event} onPress={() => navigation.push('Event', { event: event._id })} />
        )}
        renderOnEveryDay={false}
      />
    </View>
  )
}
