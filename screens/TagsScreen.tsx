import Feather from '@expo/vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import {
  Button,
  Dialog,
  FAB,
  List,
  Subheading,
  Text,
  TextInput,
  Title,
  TouchableRipple,
} from 'react-native-paper'
import { Eventful } from 'types'
import { LoadingView } from '../components/LoadingView'
import { useSession } from '../eventfulLib/session'
import { useTags } from '../eventfulLib/tag'
import { extend } from '../libs/log'
import { c, s } from '../libs/styles'

const log = extend('tagsscreen')

export const TagsScreen = ({ navigation }: Eventful.RN.UserStackScreenProps<'Tags'>) => {
  const { session } = useSession()
  const { data, isFetching, addTag } = useTags({ user: session?._id })
  const [addTagName, setAddTagName] = useState('')
  const [showAddTag, setShowAddTag] = useState(false)

  return (
    <LoadingView
      loading={isFetching || !data}
      style={[s.flx_1, s.c]}
      edges={['bottom', 'left', 'right']}
    >
      <View style={[s.flx_c]}>
        {data?.map((tag) => (
          <List.Item
            key={tag._id.toString()}
            onPress={() => navigation.push('Tag', { tag: tag._id })}
            title={tag.name ?? 'Untitled tag'}
            description={tag.createdBy.username}
          />
        ))}
      </View>
      <FAB
        icon={(props) => <Feather {...props} name="plus" />}
        style={s.fab}
        onPress={() => setShowAddTag(true)}
      />
      <Dialog visible={showAddTag} onDismiss={() => setShowAddTag(false)}>
        <Dialog.Content>
          <TextInput label="Tag name" value={addTagName} onChangeText={setAddTagName} />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowAddTag(false)}>Cancel</Button>
          <Button
            disabled={!addTagName.length}
            onPress={() => {
              setShowAddTag(false)
              addTag({ name: addTagName }).then((res) =>
                navigation.push('Tag', { tag: res.data._id })
              )
            }}
          >
            Add
          </Button>
        </Dialog.Actions>
      </Dialog>
    </LoadingView>
  )
}
