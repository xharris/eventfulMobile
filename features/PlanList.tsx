import Feather from '@expo/vector-icons/Feather'
import { useFormik } from 'formik'
import React, { useMemo, useState } from 'react'
import { FlatList, View, ViewProps } from 'react-native'
import { Eventful } from 'types'
import { Checkbox, getOnCheckboxColor } from '../components/Checkbox'
import { Spacer } from '../components/Spacer'
import { useEvent } from '../eventfulLib/event'
import { useMessages } from '../eventfulLib/message'
import { useSession } from '../eventfulLib/session'
import { Message } from '../features/Message'
import { Plan } from '../features/Plan'
import { c, s, spacing } from '../libs/styles'
import { FAB, IconButton, Menu, Portal } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { MessageList } from './MessageList'
import { CATEGORY_INFO, usePlan, usePlans } from '../eventfulLib/plan'
import { CATEGORY_ICON } from '../libs/plan'
import { H4 } from '../components/Header'
import { useChatCtx } from './ChatCtx'
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
      <Modal visible={addPlanVisible} onDismiss={() => setAddPlanVisible(false)}>
        {Object.entries(CATEGORY_INFO)
          .reverse()
          .map(([key, cat]) => (
            <Menu.Item
              key={key}
              title={cat.label}
              icon={CATEGORY_ICON[parseInt(key)]}
              onPress={() => {
                setAddPlanVisible(false)
                onPlanAdd({ category: parseInt(key) })
              }}
            />
          ))}
      </Modal>
      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 4 }}
        renderItem={({ item }) => (
          <View style={[s.flx_1]}>
            <Plan plan={item} onPress={() => onPlanPress(item._id)} />
          </View>
        )}
      />
      <View style={[s.flx_r, s.jcsb]}>
        <Spacer />
        <IconButton
          icon={(props) => <Feather name="plus" {...props} />}
          onPress={() => setAddPlanVisible(true)}
        />
      </View>
    </View>
  )
}
