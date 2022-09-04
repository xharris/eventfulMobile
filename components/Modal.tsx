import React, { ComponentProps } from 'react'
import { View } from 'react-native'
import { Modal as PaperModal, Portal } from 'react-native-paper'
import { s } from '../libs/styles'

interface ModalProps extends ComponentProps<typeof PaperModal> {}

export const Modal = ({ style, children, ...props }: ModalProps) => (
  <Portal>
    <PaperModal {...props} style={[s.c]} contentContainerStyle={[s.flx_0]}>
      <View style={[s.flx_c, s.surf, s.ais, style]}>{children}</View>
    </PaperModal>
  </Portal>
)
