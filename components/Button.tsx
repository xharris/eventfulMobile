import { ComponentProps } from 'react'
import { Button as RButton } from 'react-native'
import { c } from '../libs/styles'

export const Button = ({ color, ...props }: ComponentProps<typeof RButton>) => (
  <RButton {...props} color={c.oneDark} />
)
