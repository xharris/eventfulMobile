import React from 'react'
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
  return (
    <Pressable
      style={[s.flx_r, s.aic]}
      android_ripple={{
        color: c.oneDark,
      }}
      {...props}
    >
      <Avatar
        username={message.createdBy.username}
        style={{
          marginVertical: prevSameUser ? 2 : 2,
          marginHorizontal: 4,
          opacity: prevSameUser ? 0 : 1,
        }}
      />
      <Spacer />
      <H6>{message.text}</H6>
    </Pressable>
  )
}
