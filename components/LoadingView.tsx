import React from 'react'
import { View, ViewProps } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context'
import { s } from '../libs/styles'
import { useHeaderHeight } from '@react-navigation/elements'

interface LoadingViewProps extends SafeAreaViewProps {
  loading?: boolean
}

export const LoadingView = ({ loading, children, style, ...props }: LoadingViewProps) => {
  const h = useHeaderHeight()

  return (
    <SafeAreaView
      {...props}
      style={[{ marginTop: h }, ...(loading ? [s.flx_1, s.aic, s.jcc] : []), style]}
    >
      {loading ? <ActivityIndicator size="large" /> : children}
    </SafeAreaView>
  )
}
