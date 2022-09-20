import Feather from '@expo/vector-icons/Feather'
import React, { useMemo, useState } from 'react'
import { FlatList, View, ViewProps } from 'react-native'
import { Eventful } from 'types'
import { Spacer } from '../components/Spacer'
import { useEvent } from '../eventfulLib/event'
import { Plan } from '../features/Plan'
import { c, s } from '../libs/styles'
import { Button, Dialog, Headline, IconButton, List, Menu, Portal } from 'react-native-paper'
import { CATEGORY_INFO } from '../eventfulLib/plan'
import { CATEGORY_ICON } from '../libs/plan'
import { Modal } from '../components/Modal'

interface PlanListProps extends ViewProps {
  event?: Eventful.ID
  onPlanPress: (id: Eventful.ID) => void
  onPlanAdd: (body: Eventful.API.PlanAdd) => void
}

export const PlanList = ({
  event: eventId,
  onPlanPress,
  onPlanAdd,
  style,
  ...props
}: PlanListProps) => {
  const { data: event } = useEvent({ id: eventId })
  const [addPlanVisible, setAddPlanVisible] = useState(false)

  const items = useMemo(
    () =>
      event?.plans.sort((a, b) => {
        if (!a.time?.start || !b.time?.start) {
          if (!b.time?.start) {
            return -1
          }
          if (!a.time?.start) {
            return 1
          }
          return 0
        }
        return b.time?.start?.date.valueOf() - a.time?.start?.date.valueOf()
      }),
    [event]
  )

  return (
    <View style={[s.c, style]} {...props}>
      <View style={[s.flx_r]}>
        <View
          style={[
            {
              borderTopColor: c.onBg,
              borderTopWidth: 1,
            },
          ]}
        />
      </View>
      <Portal>
        <Dialog visible={addPlanVisible} onDismiss={() => setAddPlanVisible(false)}>
          <Dialog.Content>
            {Object.entries(CATEGORY_INFO)
              .reverse()
              .map(([key, cat]) => (
                <List.Item
                  key={key}
                  left={(props) => <List.Icon {...props} icon={CATEGORY_ICON[parseInt(key)]} />}
                  onPress={() => {
                    setAddPlanVisible(false)
                    onPlanAdd({ category: parseInt(key) })
                  }}
                  title={cat.label}
                />
              ))}
          </Dialog.Content>
        </Dialog>
      </Portal>
      {!!items?.length ? (
        <FlatList
          data={items}
          keyExtractor={(item) => item._id.toString()}
          contentContainerStyle={{ padding: 4 }}
          renderItem={({ item }) => (
            <View style={[s.flx_1]}>
              <Plan plan={item} onPress={() => onPlanPress(item._id)} />
            </View>
          )}
        />
      ) : (
        <View style={[s.flx_1, s.jcc, s.c, s.aic]}>
          <Headline>No plans yet...</Headline>
          <Spacer size={50} />
          <Button
            icon={(props) => <Feather {...props} name="plus" />}
            mode="contained"
            onPress={() => setAddPlanVisible(true)}
          >
            Add a plan
          </Button>
        </View>
      )}
      {!!items?.length ? (
        <View style={[s.flx_r, s.jcsb]}>
          <Spacer />
          <IconButton
            icon={(props) => <Feather name="plus" {...props} />}
            onPress={() => setAddPlanVisible(true)}
          />
        </View>
      ) : null}
    </View>
  )
}
