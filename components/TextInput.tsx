import { ComponentProps, FC } from 'react'
import { TextInput as PTextInput } from 'react-native-paper'

export type TextInputProps = ComponentProps<typeof PTextInput>

export const TextInput: FC<TextInputProps> = ({ ...props }) => <PTextInput {...props} />

// styled.TextInput({
//   fontSize: s.h4.fontSize,
//   borderColor: c.twoDark,
//   borderBottomWidth: 1,
//   padding: spacing.inputPadding,
// })
