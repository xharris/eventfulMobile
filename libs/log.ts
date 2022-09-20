import { consoleTransport, fileAsyncTransport, logger } from 'react-native-logs'
import * as EFS from 'expo-file-system'
import { InteractionManager } from 'react-native'

const log = logger.createLogger<'debug' | 'info' | 'warn' | 'error'>({
  transport: [consoleTransport, fileAsyncTransport],
  transportOptions: {
    FS: EFS,
    fileName: 'log.txt',
  },
  dateFormat: (date) => `${date.valueOf().toString()} | `,
  async: true,
  asyncFunc: InteractionManager.runAfterInteractions,
})

export const logExtend = log.extend

export const getLogs = () =>
  EFS.readAsStringAsync(`${EFS.documentDirectory}log.txt`).catch(() =>
    log.error(`${EFS.documentDirectory}log.txt not found`)
  )
