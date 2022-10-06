import React from 'react'
import { Text } from 'react-native-paper'
import { View } from 'react-native'
import { Eventful } from 'types'
import { s, spacing } from '../libs/styles'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { usePings } from '../eventfulLib/ping'
import { LoadingView } from '../components/LoadingView'

export const PingsScreen = ({ navigation }: Eventful.RN.MainStackScreenProps<'Pings'>) => {
  const { data: pings } = usePings()

  return (
    <LoadingView style={[s.c]}>
      {pings?.map((ping) => (
        <Text>{ping.label}</Text>
      ))}
    </LoadingView>
  )
}
