import React from 'react'
import { View, ViewProps } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context'
import { s } from '../libs/styles'

interface LoadingViewProps extends SafeAreaViewProps {
  loading: boolean
}

export const LoadingView = ({ loading, children, style, ...props }: LoadingViewProps) => (
  <SafeAreaView {...props} style={loading ? [s.flx_1, s.aic, s.jcc] : style}>
    {loading ? <ActivityIndicator size="large" /> : children}
  </SafeAreaView>
)
