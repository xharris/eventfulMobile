import React from 'react'
import Feather from '@expo/vector-icons/Feather'
import AntDesign from '@expo/vector-icons/AntDesign'
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon'

export const CATEGORY_ICON: Record<number, IconSource> = {
  0: (props) => <Feather {...props} name="file" />,
  1: (props) => <Feather {...props} name="home" />,
  2: (props) => <AntDesign {...props} name="car" />,
  3: (props) => <Feather {...props} name="map-pin" />,
}
