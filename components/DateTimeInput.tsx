import Feather from '@expo/vector-icons/Feather'
import moment from 'moment-timezone'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Pressable, View, ViewProps } from 'react-native'
import { Eventful } from 'types'
import { c, s } from '../libs/styles'
import { H4 } from './Header'
import { Spacer } from './Spacer'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { Caption } from 'react-native-paper'

const parseDate = (date: Date) => moment(date).toDate()

export interface DateTimeInputProps extends ViewProps {
  defaultValue?: Eventful.TimePart
  onChange: (v: Eventful.TimePart | null) => void
  label?: string
}

/** Input for date/time */
export const DateTimeInput = ({
  defaultValue,
  onChange,
  style,
  label,
  ...props
}: DateTimeInputProps) => {
  const [mode, setMode] = useState<'date' | 'time' | null>(null)
  const [date, setDate] = useState(defaultValue?.date ? parseDate(defaultValue.date) : null)
  const [time, setTime] = useState(
    defaultValue?.date && !defaultValue.allday ? parseDate(defaultValue?.date) : null
  )
  const [allday, setAllday] = useState(defaultValue?.allday)

  useEffect(() => {
    if (defaultValue) {
      setDate(parseDate(defaultValue.date))
      setTime(defaultValue?.date && !defaultValue.allday ? parseDate(defaultValue?.date) : null)
    }
  }, [defaultValue])

  const changed = useCallback(
    (_date: Date | null, _time: Date | null) => {
      if (onChange) {
        setAllday(!_time)
        if (_time && !_date) {
          _date = new Date()
        }
        onChange(
          _date
            ? {
                date: moment(
                  [
                    moment(_date).format('YYYY-MM-DD'),
                    _time ? moment(_time).format('HH:mm') : '',
                  ].join(' '),
                  'YYYY-MM-DD HH:mm'
                )
                  .utc()
                  .toDate(),
                allday: !_time,
              }
            : null
        )
      }
    },
    [onChange]
  )

  const currentValue = useMemo(() => moment(time ?? Date.now()).toDate(), [time])

  const onDateTimePickerChange = useCallback(
    (e: DateTimePickerEvent, v?: Date) => {
      setMode(null)
      const cleared = e.type === 'neutralButtonPressed'
      if (v && e.type !== 'dismissed') {
        if (cleared) {
          // date -> rem date, rem time
          if (mode === 'date') {
            setDate(null)
            setTime(null)
            changed(null, null)
          }
          // time -> rem time
          if (mode === 'time') {
            setTime(null)
            changed(date, null)
          }
        } else {
          // date = date
          // date + time = date + time
          // time = date + time
          if (mode === 'date') {
            setDate(v)
          }
          if (mode === 'time') {
            if (!date) {
              setDate(v)
            }
            setTime(v)
          }
          changed(
            mode === 'date' || (mode === 'time' && !date) ? v : date,
            mode === 'time' ? v : time
          )
        }
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
