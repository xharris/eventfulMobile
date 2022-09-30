import Feather from '@expo/vector-icons/Feather'
import { useFormik } from 'formik'
import React, { useEffect, useMemo, useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'
import {
  ActivityIndicator,
  FAB,
  IconButton,
  Menu,
  Portal,
  TouchableRipple,
} from 'react-native-paper'
import { Eventful } from 'types'
import { AvatarGroup } from '../components/Avatar'
import { Button } from '../components/Button'
import { H5 } from '../components/Header'
import { useSnackbar } from '../components/Snackbar'
import { Spacer } from '../components/Spacer'
import { TextInput } from '../components/TextInput'
import { TimeInput } from '../components/TimeInput'
import { CATEGORY_INFO, usePlan } from '../eventfulLib/plan'
import { useSession } from '../eventfulLib/session'
import { AreYouSure } from '../libs/dialog'
import { CATEGORY_ICON } from '../libs/plan'
import { c, s, spacing } from '../libs/styles'
import { ContactSelectEvent } from './ContactSelect'

export const PlanEditScreen = ({
  navigation,
  route,
}: Eventful.RN.MainStackScreenProps<'PlanEdit'>) => {
  const { plan: planId } = route.params
  const { data: plan, updatePlan, deletePlan, isFetching, isRefetching } = usePlan({ plan: planId })
  const [menuVisible, setMenuVisible] = useState(false)
  const { show } = useSnackbar()

  const { errors, setFieldValue, resetForm, values, dirty, submitForm } = useFormik({
    initialValues: {
      _id: null,
      ...plan,
      who: plan?.who?.map((user) => user._id) ?? [],
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      if (plan) {
        updatePlan({
          ...values,
          _id: plan?._id,
        }).then(() => resetForm())
      }
    },
  })

  const info = useMemo(() => CATEGORY_INFO[values.category ?? plan?.category ?? 0], [plan, values])

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Edit plan',
      headerRight: () => (
        <Menu
          visible={menuVisible}
          anchor={
            <IconButton
              icon={CATEGORY_ICON[values.category ?? 0]}
              onPress={() => setMenuVisible(true)}
            />
          }
          onDismiss={() => setMenuVisible(false)}
        >
          {Object.entries(CATEGORY_INFO).map(([key, cat]) => (
            <Menu.Item
              key={key}
              icon={CATEGORY_ICON[parseInt(key)]}
              title={cat.label}
              onPress={() => {
                setMenuVisible(false)
                setFieldValue('category', parseInt(key))
              }}
            />
          ))}
        </Menu>
      ),
    })
  }, [navigation, menuVisible, values])

  const { session } = useSession()

  ContactSelectEvent.useListen((users) => {
    setFieldValue('who', users)
  })

  return isFetching && !isRefetching ? (
    <View style={[s.c, s.flx_1]}>
      <ActivityIndicator size="large" />
    </View>
  ) : (
    <Portal.Host>
      <View style={[s.c, s.flx_1, s.jcsb]}>
        <KeyboardAvoidingView
          behavior="position"
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
          <ScrollView>
            {info.fields.what ? (
              <TextInput
                label="What"
                error={!!errors['what']}
                value={values.what}
                onChangeText={(v) => setFieldValue('what', v)}
              />
            ) : null}
            <Spacer />
            {info.fields.location ? (
              <TextInput
                label="Where"
                value={values.location?.address ?? ''}
                onChangeText={(v) => setFieldValue('location.address', v)}
              />
            ) : null}
            <Spacer />
            {info.fields.who ? (
              <TouchableRipple
                onPress={() =>
                  session &&
                  navigation.push('ContactSelect', {
                    user: session._id,
                    selected: values.who ?? [],
                  })
                }
              >
                <View style={[s.flx_r, s.aic, s.jcsb, s.c]}>
                  <H5 style={{ color: c.oneDark }}>Who</H5>
                  <AvatarGroup avatars={values.who?.map((id) => ({ id }))} />
                </View>
              </TouchableRipple>
            ) : null}
            <Spacer />
            {info.fields.time ? (
              <TimeInput
                // label="When"
                startLabel="Start"
                endLabel="End"
                defaultValue={values.time}
                onChange={(v) => {
                  setFieldValue('time', v)
                }}
              />
            ) : null}
            <TextInput
              label="Note"
              value={values.note ?? ''}
              onChangeText={(v) => setFieldValue('note', v)}
              multiline
            />
            <Portal>
              {dirty ? (
                <FAB
                  style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
                  icon={(props) => <Feather {...props} name="save" />}
                  onPress={submitForm}
                />
              ) : null}
            </Portal>
          </ScrollView>
        </KeyboardAvoidingView>
        <Button
          icon={() => <Feather name="trash-2" size={s.h5.fontSize} color={c.err} />}
          title="Delete"
          color={c.err}
          onPress={() =>
            AreYouSure('Delete plan?', () => {
              deletePlan(planId)
              show({
                text: 'Plan deleted',
              })
              navigation.pop()
            })
          }
        />
      </View>
    </Portal.Host>
  )
}
