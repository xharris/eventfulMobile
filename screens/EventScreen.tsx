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
import { FAB, IconButton, Menu, Modal, Portal } from 'react-native-paper'
import createStateContext from 'react-use/lib/factory/createStateContext'
import { CommonActions, CompositeScreenProps, useNavigation } from '@react-navigation/native'
import { useStorage } from '../libs/storage'
import { CATEGORY_INFO, usePlans } from '../eventfulLib/plan'
import { CATEGORY_ICON } from '../libs/plan'

const [useChatCtx, ChatCtxProvider] = createStateContext<{
  options: { plans: boolean; messages: boolean }
  editing?: Eventful.API.MessageGet
  replying?: Eventful.API.MessageGet
}>({
  options: { plans: true, messages: true },
  editing: undefined,
  replying: undefined,
})

type MessageProps = {
  type: 'message'
  key: string
  data: Eventful.API.MessageGet
}

interface PlanProps {
  type: 'plan'
  key: string
  data: Eventful.API.PlanGet
}

type Item = MessageProps | PlanProps

const EventInput = ({ event }: { event: Eventful.ID }) => {
  const [text, setText] = useState('')
  const { addMessage, updateMessage } = useMessages({ event })
  const [{ options, editing, replying }, setChatCtx] = useChatCtx()
  const [fabVisible, setFabVisible] = useState(false)
  const { addPlan } = usePlans({ event })

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
          <Button
            iconRight={() => <Feather name="send" size={s.h5.fontSize} />}
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
      <Portal>
        <FAB.Group
          style={{
            paddingBottom: 50,
            paddingRight: 20,
          }}
          visible={!editing && !replying}
          open={fabVisible}
          icon={(props) =>
            fabVisible ? <Feather name="x" {...props} /> : <Feather name="plus" {...props} />
          }
          actions={Object.entries(CATEGORY_INFO)
            .reverse()
            .map(([key, cat]) => ({
              icon: CATEGORY_ICON[parseInt(key)],
              label: cat.label,
              onPress: () => addPlan({ category: parseInt(key) }),
              small: key !== '0',
            }))}
          onStateChange={({ open }) => setFabVisible(open)}
          onPress={() => setFabVisible(!fabVisible)}
        />
      </Portal>
    </View>
  )
}

const MessageList = ({
  event: eventId,
  onPlanPress,
}: {
  event?: Eventful.ID
  onPlanPress: (id: Eventful.ID) => void
}) => {
  const navigation = useNavigation()
  const { data: messages } = useMessages({ event: eventId })
  const [{ options, editing, replying }, setChatCtx] = useChatCtx()
  const { data: event } = useEvent({ id: eventId })
  const { session } = useSession()

  const items = useMemo(
    () =>
      [
        ...(options.plans && event
          ? event?.plans.map((data) => ({
              type: 'plan',
              key: data._id,
              data,
            }))
          : []),
        ...(options.messages && messages
          ? messages?.map((data) => ({
              type: 'message',
              key: data._id,
              data,
            }))
          : []),
      ].sort((a, b) => new Date(b.data.createdAt).valueOf() - new Date(a.data.createdAt).valueOf()),
    [event, messages, options]
  )

  const [messageMenuVisible, setMessageMenuVisible] = useState<string>('')

  return (
    <View style={[s.c, s.flx_1]}>
      <View style={[s.flx_r, { paddingHorizontal: s.c.padding }]}>
        <Checkbox
          label="Messages"
          checked={options.messages}
          iconRight={() => (
            <Feather
              name="message-circle"
              size={s.h6.fontSize}
              color={getOnCheckboxColor(options.messages)}
            />
          )}
          onChange={(v) =>
            setChatCtx((prev) => ({
              ...prev,
              options: { ...prev.options, messages: !prev.options.messages },
            }))
          }
        />
        <Spacer />
        <Checkbox
          label="Plans"
          checked={options.plans}
          iconRight={() => (
            <Feather
              name="calendar"
              size={s.h6.fontSize}
              color={getOnCheckboxColor(options.plans)}
            />
          )}
          onChange={(v) =>
            setChatCtx((prev) => ({
              ...prev,
              options: { ...prev.options, plans: !prev.options.plans },
            }))
          }
        />
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.key}
        contentContainerStyle={{ padding: 4 }}
        renderItem={({ item: _item, index }) => {
          if (_item.type === 'message') {
            const item = _item as MessageProps
            return (
              <Menu
                visible={messageMenuVisible === item.key}
                anchor={
                  <View style={[s.ass, s.ais]}>
                    <Message
                      message={item.data}
                      prevSameUser={
                        index < items.length - 1 &&
                        items[index + 1].type === 'message' &&
                        (items[index + 1] as MessageProps).data.createdBy._id ===
                          item.data.createdBy._id
                      }
                      delayLongPress={100}
                      onLongPress={() => setMessageMenuVisible(item.key)}
                    />
                  </View>
                }
                onDismiss={() => setMessageMenuVisible('')}
              >
                {session?._id === item.data.createdBy._id ? (
                  <Menu.Item
                    title="Edit"
                    onPress={() => {
                      setChatCtx((prev) => ({ ...prev, editing: item.data }))
                      setMessageMenuVisible('')
                    }}
                  />
                ) : null}
                <Menu.Item
                  title="Reply"
                  onPress={() => {
                    setChatCtx((prev) => ({ ...prev, replying: item.data }))
                    setMessageMenuVisible('')
                  }}
                />
              </Menu>
            )
          }
          if (_item.type === 'plan') {
            const item = _item as PlanProps
            return (
              <View style={[s.flx_1]}>
                <Plan plan={item.data} onPress={() => onPlanPress(item.data._id)} />
              </View>
            )
          }
          return null
        }}
        inverted
      />
    </View>
  )
}

export const EventScreen = ({ navigation, route }: Eventful.RN.EventStackScreenProps<'Event'>) => {
  const { event: eventId } = route.params
  const { data: event, updateEvent } = useEvent({ id: eventId })
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

  useEffect(() => {
    store({ lastEvent: eventId })
  }, [eventId])

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Button
          transparent
          title={event?.name}
          iconRight={() => (
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
            <Button
              transparent
              iconLeft={() => <Feather name="menu" size={s.h5.fontSize} />}
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
        </Menu>
      ),
    })
  }, [navigation, event, dirty, session, menuVisible])

  return (
    <ChatCtxProvider>
      <View style={[s.flx_c, s.flx_1]}>
        <Portal.Host>
          <MessageList
            event={eventId}
            onPlanPress={(id) => navigation.push('PlanEdit', { plan: id })}
          />
          <EventInput event={eventId} />
        </Portal.Host>
      </View>
      <Portal>
        <Modal visible={showTitleEdit} onDismiss={() => setShowTitleEdit(false)} style={[s.c]}>
          <View
            style={[
              s.c,
              s.flx_c,
              {
                backgroundColor: c.surf,
              },
            ]}
          >
            <TextInput
              label="Event name"
              value={values.name}
              onChangeText={(v) => setFieldValue('name', v)}
            />
            <Spacer />
            <View style={[s.flx_r, s.asfe]}>
              <Button title="Cancel" onPress={() => setShowTitleEdit(false)} transparent />
              <Spacer />
              <Button
                title="Save"
                disabled={!dirty}
                onPress={() => {
                  setShowTitleEdit(false)
                  submitForm()
                }}
                transparent
              />
            </View>
          </View>
        </Modal>
      </Portal>
    </ChatCtxProvider>
  )
}
