import { ExpoConfig } from '@expo/config-types'
import 'dotenv/config'
import { withAndroid33 } from './plugins/android33'

const { MAPS_KEY, NODE_ENV } = process.env as unknown as {
  MAPS_KEY: string
  NODE_ENV: 'development' | 'production'
}

export default {
  name: 'eventfulMobile',
  slug: 'eventfulMobile',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: NODE_ENV === 'production' ? 'eventful' : 'com.xhh.eventfulMobile',
  userInterfaceStyle: 'automatic',
  // splash: {
  //   image: './assets/images/splash.png',
  //   resizeMode: 'contain',
  //   backgroundColor: '#ffffff'
  // },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    // major.rev.minor
    buildNumber: '1.0.0',
    bundleIdentifier: 'com.xhh.eventfulMobile',
    supportsTablet: true,
    googleServicesFile: './GoogleService-Info.plist',
    infoPlist: {
      UIBackgroundModes: ['fetch', 'remote-notification'],
      LSApplicationQueriesSchemes: ['eventful'],
    },
    config: {
      googleMapsApiKey: MAPS_KEY,
    },
  },
  android: {
    versionCode: 1,
    package: 'com.xhh.eventfulMobile',
    googleServicesFile: './google-services.json',
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    config: {
      googleMaps: {
        apiKey: MAPS_KEY,
      },
    },
    permissions: ['READ_EXTERNAL_STORAGE', 'WRITE_EXTERNAL_STORAGE'],
  },
  web: {
    favicon: './assets/images/favicon.png',
  },
  extra: {
    ...process.env,
    eas: {
      projectId: '0467164a-4fcc-403e-9dd5-f3256883917b',
    },
  },
  plugins: [
    '@react-native-firebase/app',
    // '@react-native-firebase/messaging'
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
        },
      },
    ],
    [withAndroid33],
  ],
} as ExpoConfig
