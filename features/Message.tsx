import React from 'react'
import { View } from 'react-native'
import { Eventful } from 'types'
import { Card } from '../components/Card'
import { H5, H6 } from '../components/Header'

interface MessageProps {
  message: Eventful.API.MessageGet
}

export const Message = ({ message }: MessageProps) => {
  return (
    <View>
      <H6>{message.text}</H6>
    </View>
  )
}
