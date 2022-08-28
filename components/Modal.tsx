import { ComponentProps } from 'react'
import { View } from 'react-native'
import { Modal as PaperModal } from 'react-native-paper'
import { s } from '../libs/styles'

interface ModalProps extends ComponentProps<typeof PaperModal> {}

export const Modal = ({ style, children, ...props }: ModalProps) => (
  <PaperModal {...props} style={[s.c]}>
    <View style={[s.flx_c, s.surf, style]}>{children}</View>
  </PaperModal>
)
