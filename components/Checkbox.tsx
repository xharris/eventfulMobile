import { ReactNode, useEffect, useState } from 'react'
import { Pressable, PressableStateCallbackType, Text, TouchableOpacity, View } from 'react-native'
import Feather from '@expo/vector-icons/Feather'
import { H5, H6 } from './Header'
import { c, radius, s, spacing } from '../libs/styles'
import { Spacer } from './Spacer'

export const getOnCheckboxColor = (value: boolean) => (value ? c.onOneLight : c.onBg)

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
              backgroundColor: value ? c.oneLight : c.surf,
              borderColor: value ? c.oneLight : c.surf,
              borderWidth: 1,
              borderRadius: radius.normal,
            },
          ]}
        >
          <Feather
            name={value ? 'check' : 'x'}
            style={{
              color: value ? c.onOneLight : c.onSurf,
              fontSize: s.h6.fontSize,
            }}
          />
          <Spacer size={spacing.small} />
          {label ? (
            <H6
              style={{
                color: value ? c.onOneLight : c.onSurf,
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
