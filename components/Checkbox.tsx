import { useEffect, useState } from 'react'
import { Pressable, Text, TouchableOpacity, View } from 'react-native'
import Feather from '@expo/vector-icons/Feather'
import { H5, H6 } from './Header'
import { c, radius, s, spacing } from '../libs/styles'
import { Spacer } from './Spacer'

interface CheckboxProps {
  label: string
  checked?: boolean
  onChange?: (e: boolean) => void
}

export const Checkbox = ({ label, checked, onChange }: CheckboxProps) => {
  const [value, setValue] = useState(checked)
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
      {({ pressed }) => (
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
          <H6
            style={{
              color: value ? c.onTwoDark : c.twoDark,
            }}
          >
            {label}
          </H6>
        </View>
      )}
    </Pressable>
  )
}
