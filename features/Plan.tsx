import Feather from '@expo/vector-icons/Feather'
import React, { useMemo } from 'react'
import { View } from 'react-native'
import { Eventful } from 'types'
import { AvatarGroup } from '../components/Avatar'
import { Card, CardProps } from '../components/Card'
import { H5, H6 } from '../components/Header'
import { Spacer } from '../components/Spacer'
import { Time } from '../components/Time'
import { CATEGORY, CATEGORY_INFO, getTitle } from '../eventfulLib/plan'
import { c, s, spacing } from '../libs/styles'

interface PlanProps {
  plan: Eventful.API.PlanGet
  onPress: CardProps['onPress']
}

export const Plan = ({ plan, onPress }: PlanProps) => {
  const title = useMemo(() => getTitle(plan), [plan])

  const info = useMemo(() => CATEGORY_INFO[plan.category], [plan])

  return (
    <Card
      style={[s.flx_r, s.jcsb]}
      shadowProps={{
        style: [s.ass],
        containerStyle: { marginVertical: spacing.normal },
      }}
      onPress={onPress}
    >
      <View style={[s.flx_c, s.jcc]}>
        <H5 style={[s.bold]}>{title?.length ? title : `Untitled ${info.label.toLowerCase()}`}</H5>
        {info.fields.location && plan.location && (
          <View style={[s.flx_r, s.aic]}>
            <Feather name="map-pin" color={c.red} />
            <Spacer />
            <H6>{plan.location.address}</H6>
          </View>
        )}
        {info.fields.time && plan.time && (
          <View style={[s.flx_r, s.aic]}>
            <Feather name="clock" color={c.onSurf} />
            <Spacer />
            <Time time={plan.time} />
          </View>
        )}
      </View>
      <AvatarGroup
        avatars={plan.who?.map((user) => ({
          username: user.username,
        }))}
      />
    </Card>
  )
}
