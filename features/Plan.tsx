import Feather from '@expo/vector-icons/Feather'
import React, { useMemo } from 'react'
import { View, ViewProps } from 'react-native'
import { Caption, Card, IconButton } from 'react-native-paper'
import { Eventful } from 'types'
import { AvatarGroup } from '../components/Avatar'
import { H5, H6 } from '../components/Header'
import { Spacer } from '../components/Spacer'
import { Time } from '../components/Time'
import { CATEGORY, CATEGORY_INFO, getTitle } from '../eventfulLib/plan'
import { CATEGORY_ICON } from '../libs/plan'
import { c, s, spacing } from '../libs/styles'
import { UserAvatarGroup } from './UserAvatar'

interface PlanProps extends ViewProps {
  plan: Eventful.API.PlanGet
  onPress?: () => void
}

export const Plan = ({ plan, onPress, style, ...props }: PlanProps) => {
  const title = useMemo(() => getTitle(plan), [plan])

  const info = useMemo(() => CATEGORY_INFO[plan.category], [plan])

  const category = useMemo(
    () =>
      plan.category === CATEGORY.None
        ? plan.location
          ? CATEGORY.Meet
          : plan.category
        : plan.category,
    [plan]
  )

  return (
    <Card onPress={onPress} {...props}>
      <View style={[s.c, s.flx_r, s.ais, s.jcsb, style]}>
        {category !== 0 ? (
          <IconButton
            icon={CATEGORY_ICON[category]}
            disabled
            color={CATEGORY_INFO[category].color}
          />
        ) : null}
        <View style={[s.flx_1, s.jcc]}>
          <H5 style={[s.bold, { textAlign: 'left' }]}>
            {title?.length ? title : `Untitled ${info.label.toLowerCase()}`}
          </H5>
          {info.fields.location && plan.location ? <H6>{plan.location.address}</H6> : null}
          {!!plan.note?.length ? <Caption>{plan.note}</Caption> : null}
        </View>
        <View style={[s.flx_1, s.flx_c, s.aife, s.acsb]}>
          <View style={[s.flx_1]}>
            {!!plan.who?.length ? (
              <UserAvatarGroup
                avatars={plan.who?.map((user) => ({
                  user,
                }))}
                size="small"
              />
            ) : (
              <View />
            )}
          </View>
          <View style={[s.flx_1, s.asfe, s.jcfe]}>
            {info.fields.time && plan.time ? <Time time={plan.time} /> : <View />}
          </View>
        </View>
      </View>
    </Card>
  )
}
