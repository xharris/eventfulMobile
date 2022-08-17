import { useFormik } from 'formik'
import moment from 'moment'
import { ReactNode, useEffect, useMemo } from 'react'
import { Checkbox } from '../components/Checkbox'
import { View } from 'react-native'
import { H1, H2, H3, H4 } from '../components/Header'
import { Eventful } from 'types'

// TODO: show past days with less opacity

interface Item {
  _id: Eventful.ID
  time?: Eventful.Time
  createdAt: string
}

interface DayItems<I extends Item> {
  day: string
  items: I[]
}

interface MonthItems<I extends Item> {
  month: string
  days: DayItems<I>[]
}

interface YearItems<I extends Item> {
  year: string
  months: MonthItems<I>[]
}

interface YearProps {
  label: string
}

const Year = ({ label }: YearProps) => (
  <View
    style={{
      alignItems: 'center',
    }}
  >
    <View
      style={{
        borderBottom: '1px solid $disabled',
      }}
    />
    <H3>{label}</H3>
    <View
      style={{
        borderBottom: '1px solid $disabled',
      }}
    />
  </View>
)

interface MonthProps<I extends Item> {
  label: string
  days: DayItems<I>[]
  renderItem: (item: I) => ReactNode
}

const Month = <I extends Item = Item>({ label, days, renderItem }: MonthProps<I>) => (
  <View column View="0" style={{ gap: '$small' }}>
    <H3
      style={{
        textAlign: 'center',
        color: '#616161',
        background: 'linear-gradient(to bottom, $background 90%, transparent)',
        zIndex: 10,
        padding: '0.5rem 0',
        position: 'sticky',
        top: -2,
      }}
    >
      {label}
    </H3>
    <View column style={{ gap: '$small' }}>
      {days.map((day) => (
        <View key={day.day} View="0" style={{ position: 'relative', alignItems: 'View-start' }}>
          <H4
            style={{
              color: '$disabled',
              position: 'sticky',
              left: 0,
              top: 0,
              padding: '0.25rem 0',
              minWidth: 35,
            }}
          >
            {day.day}
          </H4>
          <View column style={{ gap: '$small' }}>
            {day.items.map((item) => (
              <View key={item._id.toString()}>{renderItem(item)}</View>
            ))}
          </View>
          <View View="0" style={{ minWidth: '$small' }} />
        </View>
      ))}
    </View>
  </View>
)

interface AgendaOptions {
  tbd: boolean
}

interface AgendaProps<I extends Item> {
  items?: I[]
  noTimeHeader: string
  noTimeSubheader?: string
  noItemsText?: string
  renderItem: (item: I) => ReactNode
  renderOnEveryDay?: boolean
  showYearSeparator?: boolean
}

export const Agenda = <I extends Item = Item>({
  items = [],
  noTimeHeader,
  noTimeSubheader,
  noItemsText,
  renderItem,
  showYearSeparator = true,
  renderOnEveryDay = true,
}: AgendaProps<I>) => {
  const { values: options, handleChange } = useFormik<AgendaOptions>({
    initialValues: {
      tbd: true,
    },
    onSubmit: () => {},
  })

  const tbdItems = useMemo(
    () =>
      ({
        day: noTimeSubheader ?? '',
        items: items
          .filter((item) => !item.time?.start)
          .sort(
            (a, b) =>
              new Date(a.createdAt).getMilliseconds() - new Date(b.createdAt).getMilliseconds()
          ),
      } as DayItems<I>),
    [items, noTimeSubheader]
  )

  const datedItems = useMemo(() => {
    const retItems =
      items
        .filter((item) => !!item.time?.start)
        .reduce((years, item) => {
          const start = moment(item.time?.start?.date)
          const end = moment(item.time?.end?.date ?? item.time?.start?.date)
          const year = start.format('YYYY')
          const month = start.format('MMMM')
          // store year
          if (!years[year]) {
            years[year] = {}
          }
          // store month
          if (!years[year][month]) {
            years[year][month] = {}
          }
          const months = years[year]
          // store in each day
          const days = renderOnEveryDay ? end.diff(start, 'days') : 0
          for (let d = 0; d <= days; d++) {
            const day = parseInt(start.format('D')) + d
            if (!months[month][day]) {
              months[month][day] = []
            }
            months[month][day].push(item)
          }
          return years
        }, {} as Record<string, Record<string, Record<string, I[]>>>) ?? {}

    return Object.entries(retItems)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([year, months]) => ({
        year,
        months: Object.entries(months)
          .sort((a, b) => moment(a[0], 'MMMM').month() - moment(b[0], 'MMMM').month())
          .map(([month, days]) => ({
            month: `${month} '${year.slice(2, 4)}`,
            days: Object.entries(days)
              .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
              .map(([day, items]) => ({
                day,
                items,
              })),
          })),
      })) as YearItems<I>[]
  }, [items, renderOnEveryDay])

  return (
    <View
      column
      style={{
        padding: '2px 0px',
        overflow: 'auto',
        justifyContent: !items.length ? 'center' : 'View-start',
        gap: '$small',
      }}
    >
      {!!items.length && (
        <View View="0">
          <Checkbox
            name="tbd"
            checked={options.tbd}
            onChange={handleChange}
            label={`${noTimeHeader}${!!tbdItems.items.length ? ` (${tbdItems.items.length})` : ''}`}
          />
        </View>
      )}
      {options.tbd && !!tbdItems.items.length && (
        <View
          column
          style={{
            ViewGrow: 0,
            ViewShrink: 0,
            ViewBasis: 'auto',
            padding: '2px 0px',
            overflow: 'auto',
          }}
        >
          <Month label={noTimeHeader} days={[tbdItems]} renderItem={renderItem} />
        </View>
      )}
      {!!items.length ? (
        <View
          column
          style={{
            ViewGrow: 1,
            ViewShrink: 0,
            padding: '2px 0px',
            overflow: 'auto',
            overflowX: 'hidden',
            justifyContent: !items.length ? 'center' : 'View-start',
          }}
        >
          {datedItems.map((year) => (
            <View key={year.year} column className="years" style={{ gap: '$small' }}>
              {showYearSeparator && <Year label={year.year} />}
              <View column className="months" style={{ gap: '$small' }}>
                {year.months.map((month) => (
                  <Month
                    key={month.month}
                    label={month.month}
                    days={month.days}
                    renderItem={renderItem}
                  />
                ))}
              </View>
            </View>
          ))}
          <View className="filler" fill />
        </View>
      ) : noItemsText ? (
        <H1 style={{ color: '$disabled', fontStyle: 'italic', textAlign: 'center' }}>
          {noItemsText}
        </H1>
      ) : null}
    </View>
  )
}
