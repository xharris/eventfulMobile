import Feather from '@expo/vector-icons/Feather'
import { useFormik } from 'formik'
import React, { useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'
import { Eventful } from 'types'
import { H5 } from '../components/Header'
import { Spacer } from '../components/Spacer'
import { useEvent } from '../eventfulLib/event'
import { useMessages } from '../eventfulLib/message'
import { useSession } from '../eventfulLib/session'
import { c, s } from '../libs/styles'
import {
  Button,
  Caption,
  Dialog,
  IconButton,
  Menu,
  Subheading,
  Text,
  TextInput,
} from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { useStorage } from '../libs/storage'
import { usePlans } from '../eventfulLib/plan'
import { AreYouSure } from '../libs/dialog'
import { MessageList } from '../features/MessageList'
import { PlanList } from '../features/PlanList'
import { ChatCtxProvider, useChatCtx } from '../features/ChatCtx'
import { extend } from '../eventfulLib/log'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TagList } from '../features/TagList'
import { Time } from '../components/Time'
import { LoadingView } from '../components/LoadingView'
import { MessageInput } from '../features/MessageInput'
import { Chat } from '../features/Chat'

const log = extend('EVENTSCREEN')

export const EventScreen = ({ navigation, route }: Eventful.RN.MainStackScreenProps<'Event'>) => {
  const { event: eventId } = route.params
  const { data: event, error, updateEvent, deleteEvent } = useEvent({ id: eventId })
  const { session } = useSession()
  const { dirty, setFieldValue, values, submitForm } = useFormik<Eventful.API.EventUpdate>({
    initialValues: {
      name: event?.name ?? '',
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      updateEvent(values)
    },
  })
  const [menuVisible, setMenuVisible] = useState(false)
  const [storage, store] = useStorage()
  const [showTitleEdit, setShowTitleEdit] = useState(false)
  const { addPlan } = usePlans({ event: eventId })

  useEffect(() => {
    if (eventId && event?.name) {
      log.info('store', { lastEvent: eventId, lastEventName: event.name })
      store({ lastEvent: eventId, lastEventName: event.name })
    }
    if (error) {
      log.error(error)
      store({ lastEvent: undefined, lastEventName: undefined })
    }
  }, [eventId, event, error])

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Button onPress={() => setShowTitleEdit(true)} mode="outlined">
          <Subheading>
            {event?.name && event?.name.length >= 27
              ? `${event?.name.slice(0, 27)}...`
              : event?.name}
          </Subheading>
        </Button>
      ),
      headerRight: () => (
        <Menu
          visible={menuVisible}
          anchor={
            <IconButton
              icon={() => <Feather name="menu" size={s.h5.fontSize} />}
              onPress={() => setMenuVisible(true)}
            />
          }
          onDismiss={() => setMenuVisible(false)}
        >
          <Menu.Item
            icon={({ size, color }) => <Feather name="bell" size={size} color={color} />}
            title="Notifications"
            onPress={() => {
              setMenuVisible(false)
              navigation.push('NotificationSetting', { type: 'events', id: eventId })
            }}
          />
          <Menu.Item
            icon={(props) => <Feather {...props} name="settings" />}
            title="Settings"
            onPress={() => {
              setMenuVisible(false)
              navigation.push('EventSetting', { event: eventId })
            }}
          />
          <Menu.Item
            icon={({ size, color }) => <Feather name="trash-2" size={size} color={c.err} />}
            title="Delete"
            onPress={() => {
              setMenuVisible(false)
              AreYouSure('Delete event?', () => {
                deleteEvent().then(() => navigation.goBack())
              })
            }}
          />
        </Menu>
      ),
    })
  }, [navigation, event, dirty, session, menuVisible])

  return (
    <ChatCtxProvider>
      <LoadingView style={[s.c, s.flx_c, s.flx_1]} edges={['bottom', 'left', 'right']}>
        <View style={[s.c, s.flx_r, s.jcsb, s.aic]}>
          {event?.time ? <Time time={event.time} /> : null}
          <TagList
            tags={event?.tags ?? []}
            onTagPress={(tag) => navigation.push('Tag', { tag: tag._id })}
          />
        </View>
        <PlanList
          style={[s.flx_1]}
          event={eventId}
          onPlanPress={(id) => navigation.push('PlanEdit', { plan: id })}
          onPlanAdd={(body) =>
            addPlan(body).then((res) => navigation.push('PlanEdit', { plan: res.data._id }))
          }
          expanded={storage?.messagesCollapsed}
        />
        <Chat event={eventId} />
      </LoadingView>
      <Dialog visible={showTitleEdit} onDismiss={() => setShowTitleEdit(false)}>
        <Dialog.Content>
          <TextInput
            label="Event name"
            value={values.name}
            onChangeText={(v) => setFieldValue('name', v)}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowTitleEdit(false)}>Cancel</Button>
          <Button
            disabled={!dirty}
            onPress={() => {
              setShowTitleEdit(false)
              submitForm()
            }}
          >
            Save
          </Button>
        </Dialog.Actions>
      </Dialog>
    </ChatCtxProvider>
  )
}
