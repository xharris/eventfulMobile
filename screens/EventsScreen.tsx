import Feather from '@expo/vector-icons/Feather'
import { useFormik } from 'formik'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Pressable, PressableProps, ScrollView, TouchableHighlightProps, View } from 'react-native'
import {
  Caption,
  Checkbox,
  Dialog,
  FAB,
  IconButton,
  List,
  Menu,
  Portal,
  TouchableRipple,
} from 'react-native-paper'
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
import { useTags } from '../eventfulLib/tag'
import { Agenda } from '../features/Agenda'
import { TagList } from '../features/TagList'
import { TagSelector } from '../features/TagSelector'
import { extend } from '../libs/log'
import { c, radius, s } from '../libs/styles'

const log = extend('eventsscreen')

const Event = ({
  event,
  onPress,
}: {
  event: Eventful.API.EventGet
  onPress: TouchableHighlightProps['onPress']
}) => (
  <TouchableRipple
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
    <View style={[s.flx_r, s.jcsb, s.flx_1]}>
      <View style={[s.flx_c, s.jcc]}>
        <View style={[s.flx_r, s.aic]}>
          <H5 style={[s.bold]}>{event.name.length > 0 ? event.name : '(Untitled event)'}</H5>
          <Spacer />
          {event.private ? <Feather name="eye-off" /> : null}
        </View>
        <TagList tags={event.tags ?? []} />
      </View>
      <View style={[s.flx_c, s.aife, s.jcc]}>
        <AvatarGroup
          avatars={event.who.map((user) => ({
            username: user.username,
          }))}
        />
        <Time time={event.time} onlyTime />
      </View>
    </View>
  </TouchableRipple>
)

export const EventsScreen = ({ navigation }: Eventful.RN.AgendaStackScreenProps<'Events'>) => {
  const { session } = useSession()
  const { data: events, createEvent, refetch, isRefetching } = useEvents()
  const { data: tags } = useTags({ user: session?._id })
  const [menuVisible, setMenuVisible] = useState(false)

  const { setFieldValue, values, submitForm } = useFormik({
    initialValues: {
      name: '',
      tags: [] as Eventful.ID[],
    },
    enableReinitialize: true,
    onSubmit: ({ tags, ...values }) =>
      createEvent(values).then((res) => {
        navigation.navigate('EventTab', {
          screen: 'Event',
          params: { event: res.data._id },
        })
      }),
  })

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [navigation])

  return (
    <SafeAreaView style={[s.c, { flex: 1, backgroundColor: c.bg }]}>
      <View style={[s.flx_c]}>
        <View style={[s.flx_r, s.aic]}>
          <TextInput
            style={[s.flx_1]}
            placeholder="What are you planning?"
            value={values.name}
            onChangeText={(v) => setFieldValue('name', v)}
            mode="outlined"
            outlineColor="transparent"
            dense
          />
          <IconButton
            icon={(props) => <Feather {...props} name="plus" />}
            disabled={!values.name.length}
            onPress={() => submitForm()}
            size={25}
            style={{ marginTop: 12 }}
          />
        </View>
        {tags?.length && !!values.name.length ? (
          <TagSelector value={values.tags} onChange={(v) => setFieldValue('tags', v)} />
        ) : null}
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
