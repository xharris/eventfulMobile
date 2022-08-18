import React from 'react'
import {
  Pressable,
  PressableProps,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
} from 'react-native'
import { c, radius, s } from '../libs/styles'
import { Shadow, ShadowProps } from 'react-native-shadow-2'

interface CardProps extends PressableProps {
  shadowProps?: ShadowProps
}

export const Card = ({ style, shadowProps, ...props }: CardProps) => (
  <Shadow
    {...shadowProps}
    distance={3}
    offset={[2, 2]}
    startColor={`${c.oneDark}7F`}
    endColor={`${c.oneDark}00`}
    style={[shadowProps?.style, { borderRadius: radius.normal }]}
  >
    <Pressable
      {...props}
      style={(props) => [
        typeof style === 'function' ? style(props) : style,
        s.c,
        {
          // borderColor: c.oneDark,
          // borderWidth: 1,
          backgroundColor: c.surf,
        },
      ]}
      android_ripple={{
        color: c.oneDark,
      }}
    />
  </Shadow>
)
