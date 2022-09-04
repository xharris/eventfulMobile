import { useFormik } from 'formik'
import moment from 'moment'
import React, { ReactNode, useEffect, useMemo } from 'react'
import { Checkbox } from '../components/Checkbox'
import { SectionList, View, Text } from 'react-native'
import { H1, H2, H3, H4, H5 } from '../components/Header'
import { Eventful } from 'types'
import { c, s, spacing } from '../libs/styles'
import { Spacer } from '../components/Spacer'
import { Headline, Subheading, Title } from 'react-native-paper'

// TODO: show past days with less opacity

interface Item {
  _id: Eventful.ID
  time?: Eventful.Time
  createdAt: string
}

interface DayItems<I extends Item> {
  key: string
  day: string
  items: I[]
}

interface MonthItems<I extends Item> {
  key: string
  month: string
  days: DayItems<I>[]
}

interface YearItems<I extends Item> {
  key: string
  year: string
  months: MonthItems<I>[]
}

interface YearProps {
  label: string
}

const Year = ({ label }: YearProps) => (
  <View style={[s.flx_r, s.aic, { paddingVertical: spacing.container }]}>
    <View
      style={[
        s.flx_1,
        {
          borderBottomColor: c.oneDark,
          borderBottomWidth: 1,
          height: 0,
          marginHorizontal: spacing.container,
        },
      ]}
    />
    <H5>{label}</H5>
    <View
      style={[
        s.flx_1,
        {
          borderBottomColor: c.oneDark,
          borderBottomWidth: 1,
          height: 0,
          marginHorizontal: spacing.container,
        },
      ]}
    />
  </View>
)

interface MonthProps<I extends Item> {
  label: string
  days: DayItems<I>[]
  renderItem: (item: I) => ReactNode
}

const Month = <I extends Item = Item>({ label, days, renderItem }: MonthProps<I>) => (
  <View style={[s.flx_c]}>
    <H3>{label}</H3>
    <View style={[s.flx_c]}>
      {days.map((day) => (
        <Day key={day.day} label={day.day} items={day.items} renderItem={renderItem} />
      ))}
    </View>
  </View>
)

interface DayProps<I extends Item> {
  label: string
  items: I[]
  renderItem: (item: I) => ReactNode
}

const Day = <I extends Item = Item>({ label, items, renderItem }: DayProps<I>) => (
  <View style={[s.flx_r]}>
    <Headline
      style={{
        minWidth: 50,
        marginTop: 12,
        opacity: 0.3,
        textAlign: 'center',
      }}
    >
      {label}
    </Headline>
    <Spacer size={spacing.normal} />
    <View style={[s.flx_c, s.flx_1]}>
      {items.map((item) => (
        <View key={item._id.toString()} style={[s.ass, s.ais, { marginBottom: spacing.normal }]}>
          {renderItem(item)}
        </View>
      ))}
    </View>
    <View />
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
  onRefresh?: () => void
  refreshing?: boolean
}

export const Agenda = <I extends Item = Item>({
  items = [],
  noTimeHeader,
  noTimeSubheader,
  noItemsText,
  renderItem,
  showYearSeparator = true,
  renderOnEveryDay = true,
  onRefresh,
  refreshing,
}: AgendaProps<I>) => {
  const {
    values: options,
    handleChange,
    setFieldValue,
  } = useFormik<AgendaOptions>({
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
        key: `${year}`,
        year,
        months: Object.entries(months)
          .sort((a, b) => moment(a[0], 'MMMM').month() - moment(b[0], 'MMMM').month())
          .map(([month, days]) => ({
            key: `${year}-${month}`,
            month: `${month} '${year.slice(2, 4)}`,
            days: Object.entries(days)
              .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
              .map(([day, items]) => ({
                key: `${year}-${month}-${day}`,
                day,
                items,
              })),
          })),
      })) as YearItems<I>[]
  }, [items, renderOnEveryDay])

  const allItems = useMemo(
    () => [
      ...(options.tbd
        ? [
            {
              title: `${noTimeHeader}${
                !!tbdItems.items.length ? ` (${tbdItems.items.length})` : ''
              }`,
              data: [tbdItems],
            },
          ]
        : []),
      ...datedItems.reduce(
        (arr, year) => [
          ...arr,
          // {
          //   title: year.year,
          //   data: [],
          // },
          ...year.months.map((month) => ({
            title: month.month,
            data: month.days,
          })),
        ],
        [] as { title: string; data: DayItems<I>[] }[]
      ),
    ],
    [tbdItems, datedItems, options]
  )

  return (
    <View style={[s.flx_c]}>
      {!!items.length && (
        <View style={[s.flx_r]}>
          <Checkbox
            checked={options.tbd}
            onChange={(v) => setFieldValue('tbd', v)}
            label={`${noTimeHeader}${!!tbdItems.items.length ? ` (${tbdItems.items.length})` : ''}`}
          />
        </View>
      )}
      {!!allItems.length ? (
        <SectionList
          sections={allItems}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <Day<I> label={item.day} items={item.items} renderItem={renderItem} />
          )}
          renderSectionHeader={({ section }) => (
            <Title style={[s.c, { opacity: 0.5 }]}>{section.title}</Title>
          )}
          // SectionSeparatorComponent={() => <H5>hi</H5>}
          stickySectionHeadersEnabled
          contentContainerStyle={{
            padding: 4,
          }}
          refreshing={refreshing}
          onRefresh={onRefresh}
          // initialScrollIndex
        />
      ) : noItemsText ? (
        <H1 style={{ color: '$disabled', fontStyle: 'italic', textAlign: 'center' }}>
          {noItemsText}
        </H1>
      ) : null}
    </View>
  )
}
