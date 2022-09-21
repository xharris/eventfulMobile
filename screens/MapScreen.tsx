import React, { useEffect, useState } from 'react'
import { Text } from 'react-native-paper'
import { Dimensions, StatusBar, View, Image } from 'react-native'
import { Eventful } from 'types'
import { s, spacing } from '../libs/styles'
import MapView, { Marker, Overlay, PROVIDER_GOOGLE, Region } from 'react-native-maps'
import * as Location from 'expo-location'
import { useHeaderHeight } from '@react-navigation/elements'
import { Button } from '../components/Button'
import imgPing from '../assets/images/ping.png'

export const MapScreen = ({ navigation }: Eventful.RN.MapStackScreenProps<'Map'>) => {
  const [location, setLocation] = useState<Location.LocationObject>()
  const [ready, setReady] = useState(false)
  useEffect(() => {
    Location.requestForegroundPermissionsAsync()
      .then(({ status }) => {
        if (status === 'granted') {
          return Location.getCurrentPositionAsync()
        }
      })
      .then((loc) => {
        if (loc) {
          setLocation(loc)
        }
        setReady(true)
      })
  })

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [navigation])

  const headerHeight = useHeaderHeight()

  return (
    <View>
      {ready ? (
        <MapView
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
          }}
          mapPadding={{
            top: StatusBar.currentHeight ?? 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
          initialRegion={
            location
              ? {
                  latitude: location?.coords.latitude,
                  longitude: location?.coords.longitude,
                  latitudeDelta: 0.1,
                  longitudeDelta: 0.1,
                }
              : undefined
          }
          provider={PROVIDER_GOOGLE}
        ></MapView>
      ) : null}
      <View style={[{ position: 'absolute', bottom: spacing.container }, s.c]}>
        <Button></Button>
      </View>
      <View
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          marginLeft: -40,
          marginTop: -40,
          transform: [{ scale: 0.5 }],
        }}
      >
        <Image source={imgPing} />
      </View>
    </View>
  )
}
