import Feather from '@expo/vector-icons/Feather'
import { useFormik } from 'formik'
import React, { useEffect, useMemo, useState } from 'react'
import { FlatList, VirtualizedList, Text, View, Keyboard, Dimensions } from 'react-native'
import { Eventful } from 'types'
import { Button } from '../components/Button'
import { Checkbox, getOnCheckboxColor } from '../components/Checkbox'
import { H4, H5 } from '../components/Header'
import { Spacer } from '../components/Spacer'
import { TextInput } from '../components/TextInput'
import { useEvent } from '../eventfulLib/event'
import { useMessages } from '../eventfulLib/message'
import { useSession } from '../eventfulLib/session'
import { Message } from '../features/Message'
import { Plan } from '../features/Plan'
import { c, s, spacing } from '../libs/styles'
import { Menu } from 'react-native-paper'

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
  const [value, setValue] = useState('')
  const { addMessage } = useMessages({ event })

  return (
    <View style={[s.flx_r, s.c]}>
      <Button
        iconRight={() => <Feather name="plus" size={s.h5.fontSize} />}
        style={{
          backgroundColor: 'transparent',
        }}
      />
      <TextInput
        style={[s.flx_1, s.h6]}
        multiline
        value={value}
        onChangeText={setValue}
        placeholder="Type a message..."
      />
      {!!value.length ? (
        <Button
          iconRight={() => <Feather name="send" size={s.h5.fontSize} />}
          style={{
            backgroundColor: 'transparent',
          }}
          onPress={() => {
            addMessage({ text: value })
            setValue('')
            // Keyboard.dismiss()
          }}
        />
      ) : null}
    </View>
  )
}

export const EventScreen = ({ navigation, route }: Eventful.RN.StackProps<'Event'>) => {
  const { event: eventId } = route.params
  const { data: event, updateEvent } = useEvent({ id: eventId })
  const { data: messages } = useMessages({ event: eventId })
  const [options, setOptions] = useState({
    plans: true,
    messages: true,
  })
  const { session } = useSession()
  const { dirty, handleChange, submitForm } = useFormik<Eventful.API.EventUpdate>({
    initialValues: {
      name: event?.name ?? '',
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      updateEvent(values)
    },
  })
  const [menuVisible, setMenuVisible] = useState(false)

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

  return (
    <View style={[s.flx_c, s.flx_1]}>
      <View style={[s.flx_r, { paddingHorizontal: s.c.padding }]}>
        <Checkbox
          checked={options.messages}
          iconRight={() => (
            <Feather
              name="message-circle"
              size={s.h6.fontSize}
              color={getOnCheckboxColor(options.messages)}
            />
          )}
          onChange={(v) => setOptions((prev) => ({ ...prev, messages: !prev.messages }))}
        />
        <Spacer />
        <Checkbox
          checked={options.plans}
          iconRight={() => (
            <Feather
              name="calendar"
              size={s.h6.fontSize}
              color={getOnCheckboxColor(options.plans)}
            />
          )}
          onChange={(v) => setOptions((prev) => ({ ...prev, plans: !prev.plans }))}
        />
      </View>
      <View style={[s.c, s.flx_1]}>
        <FlatList
          data={items}
          keyExtractor={(item) => item.key}
          contentContainerStyle={{ padding: 4 }}
          renderItem={({ item, index }) => {
            if (item.type === 'message') {
              item = item as MessageProps
              return (
                <View style={[s.ass, s.ais]}>
                  <Message
                    message={item.data}
                    prevSameUser={
                      index < items.length - 1 &&
                      items[index + 1].type === 'message' &&
                      (items[index + 1] as MessageProps).data.createdBy._id ===
                        item.data.createdBy._id
                    }
                  />
                </View>
              )
            }
            if (item.type === 'plan') {
              item = item as PlanProps
              return (
                <View style={[s.flx_1]}>
                  <Plan
                    plan={item.data}
                    onPress={() => navigation.push('PlanEditScreen', { plan: item.data._id })}
                  />
                </View>
              )
            }
            return null
          }}
          inverted
        />
      </View>
      <EventInput event={eventId} />
    </View>
  )
}
