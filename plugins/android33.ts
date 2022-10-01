import { ExpoConfig } from '@expo/config-types'
import { withGradleProperties, withPlugins } from '@expo/config-plugins'

export const withAndroid33 = (config: ExpoConfig): ExpoConfig =>
  withGradleProperties(config, (config) => ({
    ...config,
    modResults: [
      ...config.modResults,
      {
        type: 'property',
        key: 'android.buildToolsVersion',
        value: '33.0.0',
      },
    ],
  }))
