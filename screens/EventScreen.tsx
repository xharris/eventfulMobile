import Feather from '@expo/vector-icons/Feather'
import { useFormik } from 'formik'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FlatList, VirtualizedList, Text, View, Keyboard, Dimensions } from 'react-native'
import { Eventful } from 'types'
import { Button } from '../components/Button'
import { Checkbox, getOnCheckboxColor } from '../components/Checkbox'
import { H3, H4, H5, H6 } from '../components/Header'
import { Spacer } from '../components/Spacer'
import { TextInput } from '../components/TextInput'
import { useEvent } from '../eventfulLib/event'
import { useMessages } from '../eventfulLib/message'
import { useSession } from '../eventfulLib/session'
import { Message } from '../features/Message'
import { Plan } from '../features/Plan'
import { c, s, spacing } from '../libs/styles'
import { FAB, IconButton, Menu, Portal } from 'react-native-paper'
import createStateContext from 'react-use/lib/factory/createStateContext'
import { CommonActions, CompositeScreenProps, useNavigation } from '@react-navigation/native'
import { useStorage } from '../libs/storage'
import { CATEGORY_INFO, usePlans } from '../eventfulLib/plan'
import { CATEGORY_ICON } from '../libs/plan'
import { Modal } from '../components/Modal'
import { AreYouSure } from '../libs/dialog'
import { MessageList } from '../features/MessageList'
import { PlanList } from '../features/PlanList'
import { ChatCtxProvider, useChatCtx } from '../features/ChatCtx'

const EventInput = ({ event }: { event: Eventful.ID }) => {
  const [text, setText] = useState('')
  const { addMessage, updateMessage } = useMessages({ event })
  const [{ options, editing, replying }, setChatCtx] = useChatCtx()
  const navigation = useNavigation<Eventful.RN.EventStackScreenProps<'Event'>['navigation']>()

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

export const EventScreen = ({ navigation, route }: Eventful.RN.EventStackScreenProps<'Event'>) => {
  const { event: eventId } = route.params
  const { data: event, updateEvent, deleteEvent } = useEvent({ id: eventId })
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
  const [_, store] = useStorage()
  const [showTitleEdit, setShowTitleEdit] = useState(false)
  const { addPlan } = usePlans({ event: eventId })

  useEffect(() => {
    if (eventId && event?.name) {
      store({ lastEvent: eventId, lastEventName: event?.name })
    }
  }, [eventId, event])

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Button
          title={event?.name}
          icon={() => (
            <Feather
              name="edit-2"
              size={s.h5.fontSize}
              style={{ color: c.oneDark, opacity: 0.5 }}
            />
          )}
          onPress={() => setShowTitleEdit(true)}
        />
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
      <View style={[s.flx_c, s.flx_1]}>
        <PlanList
          style={[s.flx_3]}
          event={eventId}
          onPlanPress={(id) => navigation.push('PlanEdit', { plan: id })}
          onPlanAdd={(body) =>
            addPlan(body).then((res) => navigation.push('PlanEdit', { plan: res.data._id }))
          }
        />
        <MessageList event={eventId} style={[s.flx_1]} />
        <EventInput event={eventId} />
      </View>
      <Modal visible={showTitleEdit} onDismiss={() => setShowTitleEdit(false)}>
        <TextInput
          label="Event name"
          value={values.name}
          onChangeText={(v) => setFieldValue('name', v)}
        />
        <Spacer />
        <View style={[s.flx_r, s.asfe]}>
          <Button title="Cancel" onPress={() => setShowTitleEdit(false)} />
          <Spacer />
          <Button
            title="Save"
            disabled={!dirty}
            onPress={() => {
              setShowTitleEdit(false)
              submitForm()
            }}
          />
        </View>
      </Modal>
    </ChatCtxProvider>
  )
}
