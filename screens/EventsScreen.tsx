import Feather from '@expo/vector-icons/Feather'
import { useFormik } from 'formik'
import moment from 'moment'
import React, { useEffect, useMemo, useState } from 'react'
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
  Text,
  TextInput,
  TouchableRipple,
} from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Eventful } from 'types'
import { useNavUserAvatar } from '../libs/navUserAvatar'
import { Avatar, AvatarGroup } from '../components/Avatar'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { H5 } from '../components/Header'
import { Modal } from '../components/Modal'
import { Spacer } from '../components/Spacer'
import { Time } from '../components/Time'
import { useEvents } from '../eventfulLib/event'
import { useSession } from '../eventfulLib/session'
import { useTags } from '../eventfulLib/tag'
import { Agenda } from '../features/Agenda'
import { TagList } from '../features/TagList'
import { TagSelector } from '../features/TagSelector'
import { extend } from '../libs/log'
import { c, radius, s } from '../libs/styles'
import { UserAvatarGroup } from '../features/UserAvatar'
import { LoadingView } from '../components/LoadingView'

const log = extend('eventsscreen')

export const Event = ({
  event,
  color,
  onPress,
}: {
  event: Eventful.API.EventGet
  color?: string
  onPress: TouchableHighlightProps['onPress']
}) => (
  <TouchableRipple
    style={[
      s.flx_r,
      s.jcsb,
      s.aic,
      {
        borderRadius: radius.large,
        backgroundColor: color,
      },
    ]}
    onPress={onPress}
  >
    <View style={[s.flx_r, s.jcsb, s.flx_1, { padding: 6 }]}>
      <View style={[s.flx_c, s.jcc]}>
        <View style={[s.flx_r, s.aic]}>
          <View style={[s.flx_r, s.aic]}>
            <Time time={event.time} onlyTime allDayLabel="" style={{ fontSize: 12 }} />
            <Spacer />
            <Text style={[s.bold, { fontSize: 14 }]}>
              {event.name.length > 0 ? event.name : '(Untitled event)'}
            </Text>
          </View>
          <Spacer />
          {event.private ? <Feather name="eye-off" /> : null}
        </View>
        <TagList tags={event.tags ?? []} />
      </View>
      {/* <View style={[s.flx_c, s.aife, s.jcc]}> */}
      <UserAvatarGroup
        avatars={event.who.map((user) => ({
          size: 'small',
          user,
        }))}
      />
      {/* </View> */}
    </View>
  </TouchableRipple>
)

export const EventsScreen = ({ navigation }: Eventful.RN.MainStackScreenProps<'Events'>) => {
  const { session } = useSession()
  const { data: events, createEvent, refetch, isRefetching } = useEvents()
  const { data: tags } = useTags({ user: session?._id })
  useNavUserAvatar<'Events'>()

  const { setFieldValue, values, submitForm } = useFormik({
    initialValues: {
      name: '',
      tags: [] as Eventful.ID[],
    },
    enableReinitialize: true,
    onSubmit: ({ tags, ...values }) =>
      createEvent(values).then((res) => {
        navigation.push('Event', { event: res.data._id })
      }),
  })

  const avg = useMemo(
    () => (events ? events?.reduce((total, ev) => total + ev.who.length, 0) / events.length : 0),
    [events]
  )

  return (
    <LoadingView style={[{ flex: 1 }]} edges={['left', 'right', 'bottom']}>
      <Spacer />
      <Agenda
        items={events}
        noTimeHeader="TBD"
        renderItem={(event) => (
          <Event
            event={event}
            onPress={() => navigation.push('Event', { event: event._id })}
            color={event.who.length > avg ? c.twoDark : !!event.who.length ? c.twoLight : c.surf}
          />
        )}
        refreshing={isRefetching}
        onRefresh={() => refetch()}
      />
      <View style={[s.flx_c, s.c]}>
        <View style={[s.flx_r, s.aic]}>
          <TextInput
            style={[s.flx_1]}
            placeholder="What are you planning?"
            value={values.name}
            onChangeText={(v) => setFieldValue('name', v)}
            mode="flat"
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
    </LoadingView>
  )
}
