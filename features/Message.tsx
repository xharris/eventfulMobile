import Feather from '@expo/vector-icons/Feather'
import React, { useEffect, useMemo } from 'react'
import { Pressable, PressableProps, View } from 'react-native'
import { Eventful } from 'types'
import { Avatar } from '../components/Avatar'
import { Card } from '../components/Card'
import { H5, H6 } from '../components/Header'
import { Spacer } from '../components/Spacer'
import { c, s } from '../libs/styles'

interface MessageProps extends PressableProps {
  message: Eventful.API.MessageGet
  prevSameUser?: boolean
}

export const Message = ({ message, prevSameUser, ...props }: MessageProps) => {
  const showAvatar = useMemo(() => !prevSameUser || message.replyTo, [prevSameUser, message])

  return (
    <View style={[s.flx_c, s.ais]}>
      {message.replyTo ? (
        <Pressable
          style={[
            s.flx_r,
            s.aic,
            {
              marginLeft: 12,
              opacity: 0.4,
            },
          ]}
        >
          <Feather name="corner-up-left" />
          <Spacer size={12} />
          <H6 style={[s.bold]}>{message.replyTo.createdBy.username}</H6>
          <Spacer />
          <H6>{message.replyTo.text}</H6>
        </Pressable>
      ) : null}
      <Pressable
        style={[s.flx_r, s.aic, s.flx_1]}
        android_ripple={{
          color: c.oneDark,
        }}
        {...props}
      >
        <Avatar
          username={message.createdBy.username}
          style={{
            marginVertical: !showAvatar ? 2 : 2,
            marginHorizontal: 4,
            opacity: !showAvatar ? 0 : 1,
          }}
        />
        <Spacer />
        <H5>{message.text}</H5>
      </Pressable>
    </View>
  )
}
