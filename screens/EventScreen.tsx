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

const log = extend('EVENTSCREEN')

const EventInput = ({ event }: { event: Eventful.ID }) => {
  const [text, setText] = useState('')
  const { addMessage, updateMessage } = useMessages({ event })
  const [{ options, editing, replying }, setChatCtx] = useChatCtx()

  const submitMessage = useCallback(() => {
    if (editing) {
      updateMessage({
        _id: editing._id,
        text,
        replyTo: replying?._id,
      })
    } else {
      addMessage({
        text,
        replyTo: replying?._id,
      })
    }
    setText('')
    setChatCtx((prev) => ({ options: prev.options }))
  }, [replying, editing, text])

  useEffect(() => {
    if (editing) {
      setText(editing.text)
    } else {
      setText('')
    }
  }, [editing])

  return (
    <View style={[s.c, s.flx_c]}>
      {!!replying ? (
        <View style={[s.flx_r, s.aic]}>
          <IconButton
            icon={() => <Feather name="x" size={s.h5.fontSize} />}
            onPress={() => setChatCtx((prev) => ({ ...prev, replying: undefined }))}
          />
          <Spacer size={12} />
          <Feather name="corner-up-left" />
          <H5 style={[s.bold]}>{replying.createdBy.username}</H5>
          <Spacer />
          <H5>{replying.text}</H5>
        </View>
      ) : null}
      <View style={[s.flx_r, s.aic]}>
        {/* <Button
          iconRight={() => <Feather name="plus" size={s.h5.fontSize} />}
          style={{
            backgroundColor: 'transparent',
          }}
        /> */}

        {!!editing ? (
          <>
            <Feather name="edit-2" size={s.h5.fontSize} />
            <IconButton
              icon={() => <Feather name="x" size={s.h5.fontSize} />}
              onPress={() => setChatCtx((prev) => ({ ...prev, editing: undefined }))}
            />
          </>
        ) : null}
        <TextInput
          style={[s.flx_1, { paddingTop: 10 }]}
          dense
          multiline
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
        />
        {!!text.length ? (
          <IconButton
            icon={() => <Feather name="send" size={s.h5.fontSize} />}
            style={{
              backgroundColor: 'transparent',
            }}
            onPress={() => {
              submitMessage()
              // Keyboard.dismiss()
            }}
          />
        ) : null}
      </View>
    </View>
  )
}

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
      <LoadingView style={[s.flx_c, s.flx_1]} edges={['bottom', 'left', 'right']}>
        <View style={[s.c, s.flx_r, s.jcsb, s.aic]}>
          {event?.time ? <Time time={event.time} /> : null}
          <TagList tags={event?.tags ?? []} />
        </View>
        <PlanList
          style={[s.c, s.flx_1]}
          event={eventId}
          onPlanPress={(id) => navigation.push('PlanEdit', { plan: id })}
          onPlanAdd={(body) =>
            addPlan(body).then((res) => navigation.push('PlanEdit', { plan: res.data._id }))
          }
          expanded={storage?.messagesCollapsed}
          onExpandChange={() =>
            store({
              messagesCollapsed: !storage?.messagesCollapsed,
            })
          }
        />
        <MessageList
          event={eventId}
          style={storage?.messagesCollapsed ? null : [s.flx_1]}
          mode={storage?.messagesCollapsed ? 'single' : 'full'}
        />
        {!storage?.messagesCollapsed ? <EventInput event={eventId} /> : null}
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
