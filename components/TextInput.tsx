import { FC } from 'react'
import { TextInputProps } from 'react-native'
import { c, s, spacing, styled } from '../libs/styles'

export const TextInput: FC<TextInputProps> = styled.TextInput({
  fontSize: s.h4.fontSize,
  borderColor: c.twoDark,
  borderBottomWidth: 2,
  padding: spacing.inputPadding,
})
