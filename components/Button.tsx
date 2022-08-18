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

export const getOnButtonColor = (transparent: boolean) => (transparent ? c.oneDark : c.onOneDark)

interface ButtonProps extends PressableProps {
  color?: string
  title?: string
  titleSize?: HeaderSize
  iconRight?: () => ReactNode
  iconLeft?: () => ReactNode
  transparent?: boolean
}

export const Button = ({
  style,
  color,
  title,
  titleSize = 'h5',
  iconRight,
  iconLeft,
  disabled,
  transparent,
  ...props
}: ButtonProps) => (
  <Pressable
    {...props}
    style={(props) => [
      {
        backgroundColor: transparent ? 'transparent' : c.oneDark,
        borderRadius: radius.normal,
      },
      typeof style === 'function' ? style(props) : style,
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
                color: transparent ? c.oneDark : c.onOneDark,
                textDecorationLine: disabled ? 'line-through' : undefined,
                opacity: disabled ? 0.7 : 1,
              },
            ]}
          >
            {title}
          </Text>
        ) : null}
      </View>
      {iconRight && title ? <Spacer /> : null}
      {iconRight ? iconRight() : null}
    </View>
  </Pressable>
)
