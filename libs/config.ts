import Constants from 'expo-constants'

export default (Constants.manifest?.extra as NodeJS.ProcessEnv) ?? {}
