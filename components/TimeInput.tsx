import React, { useCallback, useState } from 'react'
import { Text, View, ViewProps } from 'react-native'
import { Checkbox } from './Checkbox'
import { DateTimeInput, DateTimeInputProps } from './DateTimeInput'
import { Eventful } from 'types'
import { Caption, IconButton } from 'react-native-paper'
import Feather from '@expo/vector-icons/Feather'
import { s } from '../libs/styles'
import { Spacer } from './Spacer'
import { H4, H5 } from './Header'

interface TimeInput extends ViewProps {
  label?: string
  startLabel?: string
  endLabel?: string
  defaultValue?: Eventful.Time
  onChange?: (v: Eventful.Time | null) => void
  small?: boolean
  gap?: string | number
  square?: number | string | true
}

export const TimeInput = ({
  label,
  defaultValue,
  onChange,
  small,
  gap,
  square,
  style,
  startLabel,
  endLabel,
  ...props
}: TimeInput) => {
  const [value, setValue] = useState(defaultValue)
  const [end, setEnd] = useState<Eventful.TimePart | undefined>(defaultValue?.end)
  const [hasEnd, setHasEnd] = useState(!!defaultValue?.end)

  const update = useCallback(
    (v: Partial<Eventful.Time> = {}) => {
      let newValue: Eventful.Time = { ...value, ...v }
      setValue((prev) => ({
        ...prev,
        ...v,
      }))
      if (v.end) {
        setEnd(v.end)
      }
      if (onChange) {
        onChange(newValue.start || newValue.end ? newValue : null)
      }
    },
    [onChange, value]
  )

  return (
    <View {...props} style={[style, s.jcsb, s.ais, s.ctrl]}>
      {label ? <Caption>{label}</Caption> : null}
      <View style={[s.flx_c]}>
        <View style={[s.flx_r, startLabel ? s.aife : s.aic]}>
          {/* <Feather name="sunrise" size={s.h4.fontSize} />
          <Spacer /> */}
          <DateTimeInput
            label={startLabel}
            style={[s.flx_1]}
            defaultValue={value?.start}
            onChange={(v) => update({ start: v ?? undefined })}
          />
          <IconButton
            icon={() => <Feather name={hasEnd ? 'chevron-up' : 'chevron-down'} />}
            onPress={() => {
              update({ end: hasEnd ? undefined : end })
              setHasEnd(!hasEnd)
            }}
          />
        </View>
        {hasEnd ? (
          <View style={[s.flx_r, s.aic]}>
            {/* <Feather name="sunset" size={s.h4.fontSize} />
            <Spacer /> */}
            <DateTimeInput
              label={endLabel}
              style={[s.flx_1]}
              defaultValue={end}
              onChange={(v) => update({ end: v ?? undefined })}
            />
            <IconButton
              style={{ opacity: 0 }}
              icon={() => <Feather name={'chevron-down'} />}
              disabled
            />
          </View>
        ) : null}
      </View>
    </View>
  )
}
