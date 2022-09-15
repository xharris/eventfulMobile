import 'dotenv/config'

const { MAPS_KEY } = process.env as unknown as { MAPS_KEY: string }

export default {
  name: 'eventfulMobile',
  slug: 'eventfulMobile',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'myapp',
  userInterfaceStyle: 'automatic',
  _splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    useFrameworks: 'static',
    googleServicesFile: './GoogleService-Info.plist',
    infoPlist: {
      UIBackgroundModes: ['fetch', 'remote-notification'],
    },
    config: {
      googleMapsApiKey: MAPS_KEY,
    },
  },
  android: {
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
  ],
}
