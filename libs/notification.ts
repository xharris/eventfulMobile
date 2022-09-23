import messaging from '@react-native-firebase/messaging'
// import firebase from '@react-native-firebase/app'
import { useEffect } from 'react'
import { Eventful } from 'types'
// import config from '../google-services.json'
import { api } from '../eventfulLib/api'
import {
  cancelAllScheduledNotificationsAsync,
  getAllScheduledNotificationsAsync,
  scheduleNotificationAsync,
  setNotificationHandler,
  useLastNotificationResponse,
} from 'expo-notifications'
import * as Linking from 'expo-linking'
import { extend } from '../eventfulLib/log'

const log = extend('LIB/NOTIFICATION')

// if (!firebase.apps.length) {
//   firebase.initializeApp({
//     clientId: config.client[0].oauth_client[0].client_id,
//     appId: config.client[0].client_info.mobilesdk_app_id,
//     apiKey: config.client[0].api_key[0].current_key,
//     databaseURL: '',
//     storageBucket: '',
//     messagingSenderId: '',
//     projectId: config.project_info.project_id,
//   })
// }

messaging().setBackgroundMessageHandler(async (msg) => {
  log.info('bg message', msg)
})

export const requestPermission = () =>
  messaging()
    .requestPermission()
    .then(
      (status) =>
        status === messaging.AuthorizationStatus.AUTHORIZED ||
        status === messaging.AuthorizationStatus.PROVISIONAL
    )

export const showLocalNotification = (payload: Eventful.NotificationPayload) =>
  new Notification(payload.notification?.title ?? '', {
    body: payload.notification?.body,
  })

export const useMessaging = () => {
  useEffect(() => {
    messaging()
      .getToken()
      .then((token) => {
        log.info('token', token)
        return api.post('fcm', { token })
      })
      .catch((err) => console.log(err))

    const unsub = messaging().onMessage((payload) => {
      log.info('fg message', payload)
    })
    return () => {
      unsub()
    }
  }, [])
  // expo last notification response
  const lastResponse = useLastNotificationResponse()
  useEffect(() => {
    const url = lastResponse?.notification.request.content.data.url as string
    if (url) {
      log.info('open url', url)
      Linking.openURL(url)
    }
  }, [lastResponse])
}

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export const cancelAllScheduledNotifications = async () => {
  log.info('cancel all scheduled notifications')
  await cancelAllScheduledNotificationsAsync()
}

export const getScheduledNotifications = async () => {
  const notifs = await getAllScheduledNotificationsAsync()

  return notifs.map(
    ({ content, identifier, trigger }) =>
      ({
        expo: {
          content,
          trigger,
          identifier,
        },
        data: content.data,
      } as Eventful.LocalNotification)
  )
}

export const scheduleNotification = async (notification: Eventful.LocalNotification) => {
  log.info('schedule notification', notification.expo)
  return await scheduleNotificationAsync(notification.expo)
}
