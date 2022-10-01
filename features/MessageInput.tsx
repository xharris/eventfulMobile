import Feather from '@expo/vector-icons/Feather'
import React, { useCallback, useEffect, useState } from 'react'
import { View, ViewProps } from 'react-native'
import { IconButton, TextInput } from 'react-native-paper'
import { Eventful } from 'types'
import { H5 } from '../components/Header'
import { Spacer } from '../components/Spacer'
import { useMessages } from '../eventfulLib/message'
import { s } from '../libs/styles'
import { useChatCtx } from './ChatCtx'

interface MessageInputProps extends ViewProps {
  event: Eventful.ID
}

export const MessageInput = ({ event, style, ...props }: MessageInputProps) => {
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
    <View style={[s.c, s.flx_c, style]} {...props}>
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
