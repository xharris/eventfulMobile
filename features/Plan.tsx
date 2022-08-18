import React, { useMemo } from 'react'
import { View } from 'react-native'
import { Eventful } from 'types'
import { AvatarGroup } from '../components/Avatar'
import { Card } from '../components/Card'
import { H5, H6 } from '../components/Header'
import { CATEGORY, CATEGORY_INFO } from '../eventfulLib/plan'
import { s } from '../libs/styles'

interface PlanProps {
  plan: Eventful.API.PlanGet
}

export const Plan = ({ plan }: PlanProps) => {
  const title = useMemo(
    () =>
      plan.category === CATEGORY.Carpool
        ? `${plan.what} carpool`
        : plan.category === CATEGORY.Lodging || plan.category === CATEGORY.Meet
        ? plan.location?.label ?? plan.location?.address
        : !!plan.what?.length
        ? plan.what
        : 'Untitled plan',
    [plan]
  )

  const info = useMemo(() => CATEGORY_INFO[plan.category], [plan])

  return (
    <Card style={[s.flx_r, s.jcsb]}>
      <View style={[s.flx_c, s.jcc]}>
        <H6 style={[s.bold]}>{title?.length ? title : `Untitled ${info.label.toLowerCase()}`}</H6>
      </View>
      <AvatarGroup
        avatars={plan.who?.map((user) => ({
          username: user.username,
        }))}
      />
    </Card>
  )
}
