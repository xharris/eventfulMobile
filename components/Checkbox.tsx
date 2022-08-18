import { ReactNode, useEffect, useState } from 'react'
import { Pressable, PressableStateCallbackType, Text, TouchableOpacity, View } from 'react-native'
import Feather from '@expo/vector-icons/Feather'
import { H5, H6 } from './Header'
import { c, radius, s, spacing } from '../libs/styles'
import { Spacer } from './Spacer'

export const getOnCheckboxColor = (value: boolean) => (value ? c.onTwoDark : c.twoDark)

interface CheckboxProps {
  label?: string
  defaultChecked?: boolean
  checked?: boolean
  onChange?: (e: boolean) => void
  iconRight?: (props: PressableStateCallbackType) => ReactNode
}

export const Checkbox = ({
  label,
  checked,
  defaultChecked,
  onChange,
  iconRight,
}: CheckboxProps) => {
  const [value, setValue] = useState(defaultChecked ?? checked)
  useEffect(() => {
    if (checked != null) {
      setValue(checked)
    }
  }, [checked])

  return (
    <Pressable
      onPress={() => {
        setValue(!value)
        if (onChange) {
          onChange(!value)
        }
      }}
      android_ripple={{
        color: c.twoDark,
      }}
      style={[s.asfs]}
    >
      {(props) => (
        <View
          style={[
            s.flx_r,
            s.aic,
            {
              padding: spacing.inputPadding,
              backgroundColor: value ? c.twoDark : 'transparent',
              borderColor: c.twoDark,
              borderWidth: 1,
              borderRadius: radius.normal,
            },
          ]}
        >
          <Feather
            name={value ? 'check' : 'x'}
            style={{
              color: value ? c.onTwoDark : c.twoDark,
              fontSize: s.h6.fontSize,
            }}
          />
          <Spacer size={spacing.small} />
          {label ? (
            <H6
              style={{
                color: value ? c.onTwoDark : c.twoDark,
              }}
            >
              {label}
            </H6>
          ) : null}
          {iconRight ? iconRight(props) : null}
        </View>
      )}
    </Pressable>
  )
}
