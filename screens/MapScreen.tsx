import React from 'react'
import { Text } from 'react-native-paper'
import { Dimensions, View } from 'react-native'
import { Eventful } from 'types'
import { s, spacing } from '../libs/styles'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'

export const MapScreen = ({ navigation }: Eventful.RN.MapStackScreenProps<'Map'>) => {
  return (
    <View style={[s.c]}>
      <MapView
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}
      ></MapView>
      <View style={{ position: 'absolute', bottom: spacing.container }}>
        <Text>hi</Text>
      </View>
    </View>
  )
}
