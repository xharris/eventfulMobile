import Feather from '@expo/vector-icons/Feather'
import { useFormik } from 'formik'
import React, { useMemo, useState } from 'react'
import { FlatList, View, ViewProps } from 'react-native'
import { Eventful } from 'types'
import { Checkbox, getOnCheckboxColor } from '../components/Checkbox'
import { Spacer } from '../components/Spacer'
import { useEvent } from '../eventfulLib/event'
import { useMessages } from '../eventfulLib/message'
import { useSession } from '../eventfulLib/session'
import { Message, MessageProps } from '../features/Message'
import { Plan } from '../features/Plan'
import { c, s, spacing } from '../libs/styles'
import { Caption, Card, Menu, Portal, Text } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { H4 } from '../components/Header'
import { useChatCtx } from './ChatCtx'
import { Modal } from '../components/Modal'
import { useStorage } from '../libs/storage'

interface MessageItemProps extends MessageProps {
  prevSameUser: boolean
  onContextMenu: () => void
}

const MessageItem = ({ prevSameUser, onContextMenu, ...props }: MessageItemProps) => (
  <Message
    {...props}
    prevSameUser={prevSameUser}
    // delayLongPress={250}
    onPress={() => onContextMenu()}
  />
)

interface MessageListProps extends ViewProps {
  event?: Eventful.ID
  mode?: 'single' | 'full'
}

export const MessageList = ({ event: eventId, mode = 'full', ...props }: MessageListProps) => {
  const { data: messages } = useMessages({ event: eventId })
  const [{ options }, setChatCtx] = useChatCtx()
  const { data: event } = useEvent({ id: eventId })
  const [messageMenuVisible, setMessageMenuVisible] = useState<Eventful.API.MessageGet>()
  const { session } = useSession()
  const [storage, setStorage] = useStorage()

  const items = useMemo(
    () =>
      messages?.sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()),
    [event, messages, options]
  )

  return (
    <View {...props}>
      {!!items?.length ? (
        <FlatList
          data={mode === 'single' ? items.slice(0, 1) : items}
          keyExtractor={(item) => item._id.toString()}
          contentContainerStyle={{ padding: 4 }}
          renderItem={({ item, index }) => (
            <MessageItem
              message={item}
              disabled={mode === 'single'}
              prevSameUser={
                mode === 'single'
                  ? false
                  : index < items.length - 1 &&
                    items[index + 1].createdBy._id === item.createdBy._id
              }
              onContextMenu={() => {
                if (mode === 'full') {
                  setMessageMenuVisible(item)
                } else {
                  setStorage({ messagesCollapsed: !storage?.messagesCollapsed })
                }
              }}
            />
          )}
          inverted
        />
      ) : mode === 'single' ? (
        <Caption>Open chat...</Caption>
      ) : null}
      <Modal
        visible={!!messageMenuVisible}
        onDismiss={() => setMessageMenuVisible(undefined)}
        style={[s.flx_c]}
      >
        {/* <View>{messageMenuVisible ? <Message message={messageMenuVisible} /> : null}</View> */}
        <View style={[s.flx_c]}>
          {session?._id === messageMenuVisible?.createdBy._id ? (
            <Menu.Item
              title="Edit"
              onPress={() => {
                setChatCtx((prev) => ({ ...prev, editing: messageMenuVisible }))
                setMessageMenuVisible(undefined)
              }}
            />
          ) : null}
          <Menu.Item
            title="Reply"
            onPress={() => {
              setChatCtx((prev) => ({ ...prev, replying: messageMenuVisible }))
              setMessageMenuVisible(undefined)
            }}
          />
        </View>
      </Modal>
    </View>
  )
}
