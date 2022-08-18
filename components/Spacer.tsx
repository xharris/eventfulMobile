import { FC } from 'react'
import { ViewProps } from 'react-native'
import { spacing, styled } from '../libs/styles'

export const Spacer: FC<ViewProps & { size?: number }> = styled.View<{ size?: number }>(
  (props) => ({
    width: props.size ?? spacing.normal,
    height: props.size ?? spacing.normal,
  })
)
