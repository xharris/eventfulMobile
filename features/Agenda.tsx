import moment from 'moment-timezone'
import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SectionList, View, Text, useWindowDimensions, ViewProps } from 'react-native'
import { H1, H2, H3, H4, H5 } from '../components/Header'
import { Eventful } from 'types'
import { c, radius, s, spacing } from '../libs/styles'
import { Spacer } from '../components/Spacer'
import { Badge, Chip, Title } from 'react-native-paper'
import Feather from '@expo/vector-icons/Feather'
import { useStorage } from '../libs/storage'
import { extend } from '../eventfulLib/log'

const log = extend('AGENDA')

interface Item {
  _id: Eventful.ID
  time?: Eventful.Time
  createdAt: string
}

interface DayItems<I extends Item> {
  key: string
  day: string
  dayOfWeek: string
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

interface DayProps<I extends Item> {
  label: string
  dayOfWeek?: string
  items: I[]
  renderItem: (item: I) => ReactNode
}

const Day = <I extends Item = Item>({ label, dayOfWeek, items, renderItem }: DayProps<I>) => (
  <View style={[s.c, s.flx_r, s.aifs]}>
    <View
      style={[
        // s.c,
        s.flx_r,
        s.aic,
        {
          opacity: 0.4,
        },
      ]}
    >
      <Text
        style={{
          textAlign: 'left',
          padding: 0,
          marginHorizontal: 0,
          fontSize: 20,
          width: 32,
        }}
      >
        {label}
      </Text>
      {dayOfWeek ? (
        <Text
          style={{
            textAlign: 'left',
            fontSize: 12,
            padding: 0,
            margin: 0,
            width: 32,
          }}
        >
          {dayOfWeek}
        </Text>
      ) : null}
    </View>
    <Spacer size={spacing.normal} />
    <View style={[s.flx_c, s.flx_1]}>
      {items.map((item) => (
        <View
          key={item._id.toString()}
          style={[s.ass, s.ais, { marginBottom: spacing.normal, padding: 2 }]}
        >
          {renderItem(item)}
        </View>
      ))}
    </View>
    <View />
  </View>
)

interface AgendaProps<I extends Item> extends ViewProps {
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
  style,
  ...props
}: AgendaProps<I>) => {
  const [storage, store] = useStorage({ agendaView: 'agenda' })
  const [loaded, setLoaded] = useState(false)
  const [isUserScroll, setIsUserScroll] = useState(false)
  // TODO add TODAY button that resets this to false

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
                dayOfWeek: moment(`${year}-${month}-${day}`, 'YYYY-MMMM-DD').format('ddd'),
                day,
                items,
              })),
          })),
      })) as YearItems<I>[]
  }, [items, renderOnEveryDay])

  const allItems = useMemo(
    () => [
      ...datedItems.reduce(
        (arr, year) => [
          ...arr,
          ...year.months.map((month) => ({
            title: month.month,
            data: month.days,
          })),
        ],
        [] as { title: string; data: DayItems<I>[] }[]
      ),
    ],
    [datedItems]
  )

  const refSectionList = useRef<SectionList<
    DayItems<I>,
    { title: string; data: DayItems<I>[] }
  > | null>(null)

  const attemptScrollToIndex = useCallback(() => {
    if (!refSectionList.current) {
      return
    }
    if (storage?.agendaScrollY != null) {
      // const { agendaScrollY } = storage
      // log.info(`scroll to y=${agendaScrollY}`)
      // refSectionList.current.scrollToLocation({
      //   animated: false,
      //   sectionIndex: 0,
      //   itemIndex: 0,
      //   viewOffset: agendaScrollY,
      // })
      // return
    }
    // check if there is even a list with items
    if (allItems.length > 0) {
      const today = moment()
      const scrollTo = moment()
      const monthIdx = allItems.findIndex((item) =>
        item.title.toLowerCase().match(today.format('MMMM').toLowerCase())
      )
      log.info(`- month ${monthIdx}`)
      // find current month
      if (monthIdx >= 0) {
        const dayIdx = allItems[monthIdx].data.findIndex((item, i) => {
          const ret = parseInt(item.day) >= today.date() || i === allItems[monthIdx].data.length - 1
          if (ret) {
            scrollTo.set('date', parseInt(item.day))
          }
          return ret
        })
        log.info(`- day ${dayIdx}`)
        // find current day
        if (dayIdx >= 0) {
          log.info(`scroll to ${scrollTo.format('l')}`)
          refSectionList.current.scrollToLocation({
            animated: false,
            sectionIndex: monthIdx,
            itemIndex: dayIdx,
          })
        }
      }
    }
  }, [allItems, refSectionList, storage, isUserScroll])

  const { height } = useWindowDimensions()

  useEffect(() => {
    log.debug('loaded', loaded)
  }, [loaded])

  return (
    <View style={[s.flx_1, s.flx_c, style]} {...props}>
      <View style={[s.flx_r, s.aic, s.c]}>
        <View>
          <Chip
            selected={storage?.agendaView === 'tbd'}
            icon={(props) => <Feather {...props} name="help-circle" />}
            onPress={() => store({ agendaView: 'tbd' })}
          >
            {noTimeHeader}
          </Chip>
          {!!tbdItems.items.length ? (
            <Badge
              style={{
                position: 'absolute',
                right: -4,
                top: -4,
                // zIndex: 1000,
              }}
            >
              {tbdItems.items.length}
            </Badge>
          ) : null}
        </View>
        <Spacer />
        <Chip
          icon={(props) => <Feather {...props} name="list" />}
          selected={storage?.agendaView === 'agenda'}
          onPress={() => store({ agendaView: 'agenda' })}
        >
          Agenda
        </Chip>
      </View>
      <Spacer />
      {!!allItems.length || !!tbdItems.items.length ? (
        storage?.agendaView === 'tbd' ? (
          <Day<I> label={tbdItems.day} items={tbdItems.items} renderItem={renderItem} />
        ) : storage?.agendaView === 'agenda' ? (
          <SectionList
            ref={refSectionList}
            sections={allItems}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => <Day<I> label={item.day} {...item} renderItem={renderItem} />}
            renderSectionHeader={({ section }) => (
              <View style={[s.ctrl, s.aife]}>
                <View
                  style={[
                    { paddingHorizontal: 8, backgroundColor: c.bg, borderRadius: radius.large },
                  ]}
                >
                  <Title>{section.title}</Title>
                </View>
              </View>
            )}
            ListFooterComponent={() => <View style={[{ height }]} />}
            stickySectionHeadersEnabled
            refreshing={refreshing}
            onRefresh={onRefresh}
            onLayout={() => {
              attemptScrollToIndex()
              setLoaded(true)
            }}
            onScrollToIndexFailed={(e) => log.error(`scrollToIndexFailed ${JSON.stringify(e)}`)}
            onScrollEndDrag={(e) => {
              setIsUserScroll(true)
            }}
            onMomentumScrollEnd={(e) => {
              if (isUserScroll) {
                store({ agendaScrollY: e.nativeEvent.contentOffset.y })
                setIsUserScroll(false)
              }
            }}
            scrollEventThrottle={400}
            initialNumToRender={10}
          />
        ) : null
      ) : noItemsText ? (
        <H1 style={{ color: '$disabled', fontStyle: 'italic', textAlign: 'center' }}>
          {noItemsText}
        </H1>
      ) : null}
    </View>
  )
}
