import { ComponentProps, FC } from 'react'
import { TextInput as PTextInput } from 'react-native-paper'

export const TextInput: FC<ComponentProps<typeof PTextInput>> = ({ ...props }) => (
  <PTextInput {...props} />
)

// styled.TextInput({
//   fontSize: s.h4.fontSize,
//   borderColor: c.twoDark,
//   borderBottomWidth: 1,
//   padding: spacing.inputPadding,
// })
