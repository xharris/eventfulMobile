import Feather from '@expo/vector-icons/Feather'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Dialog, Headline, TextInput, Title } from 'react-native-paper'
import { Eventful } from 'types'
import { Button } from '../components/Button'
import { LoadingView } from '../components/LoadingView'
import { useTag } from '../eventfulLib/tag'
import { c, s } from '../libs/styles'

export const TagScreen = ({ navigation, route }: Eventful.RN.UserStackScreenProps<'Tag'>) => {
  const { tag } = route.params
  const { data, isFetching, updateTag } = useTag({ tag })
  const [showTitleEdit, setShowTitleEdit] = useState(false)
  const { dirty, setFieldValue, values, submitForm } = useFormik<Eventful.API.TagEdit>({
    initialValues: {
      name: data?.name ?? '',
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      updateTag(values)
    },
  })

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Button
          title={data?.name}
          icon={() => (
            <Feather
              name="edit-2"
              size={s.h5.fontSize}
              style={{ color: c.oneDark, opacity: 0.5 }}
            />
          )}
          onPress={() => setShowTitleEdit(true)}
        />
      ),
    })
  }, [navigation])

  return (
    <LoadingView loading={!data || isFetching} style={[s.flx_1, s.c]}>
      <View style={[s.flx_c]}>
        <Title>{`# members`}</Title>
        <Title>Events</Title>
      </View>
      <Dialog visible={showTitleEdit} onDismiss={() => setShowTitleEdit(false)}>
        <Dialog.Content>
          <TextInput
            label="Tag name"
            value={values.name}
            onChangeText={(v) => setFieldValue('name', v)}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button title="Cancel" onPress={() => setShowTitleEdit(false)} />
          <Button
            title="Save"
            disabled={!dirty}
            onPress={() => {
              setShowTitleEdit(false)
              submitForm()
            }}
          />
        </Dialog.Actions>
      </Dialog>
    </LoadingView>
  )
}
