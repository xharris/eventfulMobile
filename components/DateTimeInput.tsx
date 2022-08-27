import Feather from '@expo/vector-icons/Feather'
import moment from 'moment'
import React, { ComponentProps, useCallback, useEffect, useMemo, useState } from 'react'
import { Platform, Pressable, View, ViewProps } from 'react-native'
import { Eventful } from 'types'
import { c, s } from '../libs/styles'
import { H4 } from './Header'
import { Spacer } from './Spacer'
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { Caption } from 'react-native-paper'

type DateTimePickerOptions = Parameters<typeof DateTimePickerAndroid['open']>[0]

export interface DateTimeInputProps extends ViewProps {
  defaultValue?: Eventful.TimePart
  onChange: (v: Eventful.TimePart | null) => void
  label?: string
}

export const DateTimeInput = ({
  defaultValue,
  onChange,
  style,
  label,
  ...props
}: DateTimeInputProps) => {
  const [mode, setMode] = useState<'date' | 'time' | null>(null)
  const [date, setDate] = useState(defaultValue?.date ? new Date(defaultValue.date) : null)
  const [time, setTime] = useState(
    defaultValue?.date && !defaultValue.allday ? new Date(defaultValue?.date) : null
  )
  const [allday, setAllday] = useState(defaultValue?.allday)

  useEffect(() => {
    if (defaultValue) {
      setDate(new Date(defaultValue.date))
      setTime(defaultValue?.date && !defaultValue.allday ? new Date(defaultValue?.date) : null)
    }
  }, [defaultValue])

  const changed = useCallback(
    (_date: string | null, _time: string | null) => {
      if (onChange) {
        setAllday(!_time)
        if (_time && !_date) {
          _date = moment(moment.now()).format('YYYY-MM-DD')
        }
        onChange(
          _date
            ? {
                date: moment([_date, _time ?? ''].join(' '), 'YYYY-MM-DD HH:mm').toDate(),
                allday: !_time,
              }
            : null
        )
      }
    },
    [onChange]
  )

  const currentValue = useMemo(
    () =>
      moment(date ?? Date.now())
        .startOf('day')
        .add(moment(time ?? Date.now()).minutes(), 'minutes')
        .toDate(),
    [date, time]
  )

  const onDateTimePickerChange = useCallback(
    (e: DateTimePickerEvent, v?: Date) => {
      setMode(null)
      const cleared = e.type === 'neutralButtonPressed'
      if (v && e.type !== 'dismissed') {
        if (mode === 'date' || !date) {
          setDate(cleared ? null : v)
        }
        if (mode === 'time') {
          setTime(cleared ? null : v)
        }
        changed(
          cleared ? null : moment(mode === 'date' || !date ? v : date).format('YYYY-MM-DD'),
          cleared ? null : moment(mode === 'time' ? v : time).format('HH:mm')
        )
      }
    },
    [mode, changed]
  )

  return (
    <View {...props} style={[style]}>
      {label ? <Caption>{label}</Caption> : null}
      <View style={[s.flx_c, s.flx_r, s.jcsa, s.ctrl]}>
        <Pressable
          style={[s.flx_r, s.aic, s.flx_2]}
          android_ripple={{ color: c.oneDark }}
          onPress={() => {
            setMode('date')
          }}
        >
          <Feather name="calendar" size={s.h4.fontSize} style={{ opacity: 0.3 }} />
          <Spacer />
          <H4 style={[]}>{date ? moment(date).format('L') : '__ /__ /__'}</H4>
        </Pressable>
        <Pressable
          style={[s.flx_r, s.aic, s.flx_1]}
          android_ripple={{ color: c.oneDark }}
          onPress={() => {
            setMode('time')
          }}
        >
          <Feather name="clock" size={s.h4.fontSize} style={{ opacity: 0.3 }} />
          <Spacer />
          <H4 style={[]}>{time && !allday ? moment(time).format('LT') : '--:-- --'}</H4>
        </Pressable>
      </View>
      {mode ? (
        <DateTimePicker
          value={currentValue}
          mode={mode}
          display={'default'}
          onChange={onDateTimePickerChange}
          style={{
            width: 300,
            height: 300,
          }}
          neutralButtonLabel={'Clear'}
        />
      ) : null}
    </View>
  )
}
