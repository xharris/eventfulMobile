import { ReactNode, useEffect, useState } from 'react'
import { Pressable, PressableStateCallbackType, Text, TouchableOpacity, View } from 'react-native'
import Feather from '@expo/vector-icons/Feather'
import { H5, H6 } from './Header'
import { c, radius, s, spacing } from '../libs/styles'
import { Spacer } from './Spacer'
import { Chip } from 'react-native-paper'

export const getOnCheckboxColor = (value: boolean) => (value ? c.onOneLight : c.onBg)

interface CheckboxProps {
  label?: string
  defaultChecked?: boolean
  checked?: boolean
  onChange?: (e: boolean) => void
  iconRight?: () => ReactNode
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
    <Chip
      onPress={() => {
        setValue(!value)
        if (onChange) {
          onChange(!value)
        }
      }}
      icon={iconRight} // () => <Feather name={value ? 'check' : 'x'} />}
      // closeIcon={iconRight}
      selected={value}
    >
      {label}
    </Chip>
  )
}
