import moment from 'moment'
import { ComponentProps, useMemo } from 'react'
import { Eventful } from 'types'
import { H6 } from './Header'

interface TimeProps extends ComponentProps<typeof H6> {
  time: Eventful.Time
}

const calendarFormat = {
  lastDay: '[Yesterday]',
  sameDay: '[Today]',
  nextDay: '[Tomorrow]',
  lastWeek: '[last] dddd',
  nextWeek: 'dddd',
  sameElse: 'L',
}
const calendarFormatTime = {
  lastDay: '[Yesterday at] LT',
  sameDay: '[Today at] LT',
  nextDay: '[Tomorrow at] LT',
  lastWeek: '[last] dddd [at] LT',
  nextWeek: 'dddd [at] LT',
  sameElse: 'LT',
}

export const Time = ({ time, ...props }: TimeProps) => {
  const str = useMemo(() => {
    const start = time.start ? moment(time.start.date) : null
    const end = time.end ? moment(time.end.date) : null

    return [
      start?.calendar(time.start?.allday ? calendarFormat : calendarFormatTime),
      end?.calendar(time.end?.allday ? calendarFormat : calendarFormatTime),
    ]
      .filter((t) => t)
      .join(' - ')
  }, [time])

  return time.start ? <H6 {...props}>{str}</H6> : null
}
