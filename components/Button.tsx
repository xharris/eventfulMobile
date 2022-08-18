import React, { ComponentProps, ReactNode } from 'react'
import {
  Button as RButton,
  Pressable,
  PressableProps,
  StyleProp,
  Text,
  View,
  ViewProps,
} from 'react-native'
import { c, s, HeaderSize, spacing, radius } from '../libs/styles'
import { Spacer } from './Spacer'

interface ButtonProps extends PressableProps {
  color?: string
  title?: string
  titleSize?: HeaderSize
  iconRight?: () => ReactNode
  iconLeft?: () => ReactNode
}

export const Button = ({
  style,
  color,
  title,
  titleSize = 'h5',
  iconRight,
  iconLeft,
  disabled,
  ...props
}: ButtonProps) => (
  <Pressable
    {...props}
    style={(props) => [
      typeof style === 'function' ? style(props) : style,
      {
        backgroundColor: c.oneDark,
        borderRadius: radius.normal,
      },
    ]}
    android_ripple={{
      color: c.oneLight,
    }}
    disabled={disabled}
  >
    <View
      style={[
        s.flx_r,
        s.aic,
        s.jcsb,
        {
          padding: spacing.controlPadding * 1.5,
        },
      ]}
    >
      <View style={[s.flx_r, s.aic, s.jcsb]}>
        {iconLeft ? iconLeft() : null}
        {iconLeft && title ? <Spacer /> : null}
        {title ? (
          <Text
            style={[
              s[titleSize],
              {
                color: c.onOneDark,
                textDecorationLine: disabled ? 'line-through' : undefined,
                opacity: disabled ? 0.7 : 1,
              },
            ]}
          >
            {title}
          </Text>
        ) : null}
      </View>
      {iconRight ? iconRight() : null}
    </View>
  </Pressable>
)
