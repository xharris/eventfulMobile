import Feather from '@expo/vector-icons/Feather'
import React, { ComponentProps, useState } from 'react'
import { View, ViewProps } from 'react-native'
import { Card, IconButton } from 'react-native-paper'
import { Eventful } from 'types'
import { useStorage } from '../libs/storage'
import { s } from '../libs/styles'
import { MessageInput } from './MessageInput'
import { MessageList } from './MessageList'

interface ChatProps extends ViewProps {
  event: Eventful.ID
}

export const Chat = ({ event, style, ...props }: ChatProps) => {
  const [storage, setStorage] = useStorage()

  return (
    <Card
      {...props}
      style={[style, storage?.messagesCollapsed ? null : [s.flx_1, s.flx_c]]}
      onPress={() => (storage?.messagesCollapsed ? setStorage({ messagesCollapsed: false }) : null)}
    >
      {storage?.messagesCollapsed ? (
        <View style={[s.flx_r, s.aic]}>
          {storage?.messagesCollapsed ? (
            <Feather name="message-square" style={[s.c]} size={24} />
          ) : null}
          <MessageList event={event} mode={'single'} />
        </View>
      ) : (
        <View style={[s.flx_1, s.flx_c]}>
          <IconButton
            style={{ position: 'absolute', right: 0, top: 0, zIndex: 10 }}
            icon={(props) => <Feather {...props} name="chevron-down" />}
            onPress={() => setStorage({ messagesCollapsed: true })}
          />
          {storage?.messagesCollapsed ? (
            <Feather name="message-square" style={[s.c]} size={24} />
          ) : null}
          <MessageList event={event} mode={'full'} style={[s.flx_1]} />
          <MessageInput event={event} style={[s.flx_0]} />
        </View>
      )}
    </Card>
  )
}
