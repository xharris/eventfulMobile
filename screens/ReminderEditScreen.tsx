import Feather from '@expo/vector-icons/Feather'
import { useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'
import { ActivityIndicator, Button, IconButton, Menu, Text, TextInput } from 'react-native-paper'
import { Eventful } from 'types'
import { Spacer } from '../components/Spacer'
import { UNIT_LABEL, useReminders } from '../eventfulLib/reminder'
import { AreYouSure } from '../libs/dialog'
import { s } from '../libs/styles'

interface ReminderProps {
  reminder: Eventful.Reminder
}

const Reminder = ({ reminder }: ReminderProps) => {
  const { setReminder, deleteReminder } = useReminders()
  const [unitOpen, setUnitOpen] = useState(false)
  const [amount, setAmount] = useState(reminder.amount?.toString() ?? '')

  useEffect(() => {
    if (amount !== reminder.amount.toString() && !!amount.length) {
      setReminder({ ...reminder, amount: parseInt(amount) })
    }
  }, [amount, reminder])

  const isPlural = useMemo(() => parseInt(amount) !== 1, [amount])

  return (
    <View style={[s.flx_r, s.aic]}>
      <View style={[s.flx_r, s.aic, s.jcc, s.flx_1]}>
        <TextInput
          style={[s.flx_1, { textAlign: 'right' }]}
          keyboardType="numeric"
          value={amount ?? ''}
          onChangeText={(v = '') => {
            const value = v.toString().replace(/\D/gi, '')
            setAmount(value)
          }}
          onBlur={() => {
            if (!amount.length) {
              setAmount('0')
            }
          }}
        />
        <Spacer size={20} />
        <Menu
          style={[s.flx_1]}
          visible={unitOpen}
          onDismiss={() => setUnitOpen(false)}
          anchor={
            <Button style={{ minWidth: 120 }} onPress={() => setUnitOpen(true)} mode="outlined">
              {`${UNIT_LABEL[reminder.unit]}${isPlural ? 's' : ''}`}
            </Button>
          }
        >
          {Object.entries(UNIT_LABEL).map(([unit, label]) => (
            <Menu.Item
              key={unit}
              title={`${label}${isPlural ? 's' : ''}`}
              onPress={() =>
                setReminder({ ...reminder, unit: unit as Eventful.Reminder['unit'] }).then(() =>
                  setUnitOpen(false)
                )
              }
            />
          ))}
        </Menu>
      </View>
      <IconButton
        icon={(props) => <Feather {...props} name="trash-2" />}
        onPress={() => AreYouSure('Delete reminder?', () => deleteReminder(reminder._id))}
      />
    </View>
  )
}

export const ReminderEditScreen = ({
  navigation,
}: Eventful.RN.UserStackScreenProps<'ReminderEdit'>) => {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
    })
  }, [navigation])

  const { data: reminders, isFetching, isRefetching, addReminder } = useReminders()

  return isFetching && !isRefetching ? (
    <View style={[s.c, s.flx_1]}>
      <ActivityIndicator size="large" />
    </View>
  ) : (
    <View style={[s.c, s.flx_1, s.flx_c]}>
      {reminders?.map((reminder) => (
        <Reminder key={reminder._id.toString()} reminder={reminder} />
      ))}
      <IconButton
        style={[s.aife]}
        icon={(props) => <Feather {...props} name="plus" />}
        onPress={() => addReminder()}
      />
    </View>
  )
}
