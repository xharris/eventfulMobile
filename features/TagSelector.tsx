import Feather from '@expo/vector-icons/Feather'
import React, { useCallback, useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import { Button, Checkbox, Dialog, List, Portal } from 'react-native-paper'
import { Eventful } from 'types'
import { useSession } from '../eventfulLib/session'
import { useTags } from '../eventfulLib/tag'
import { s } from '../libs/styles'

interface TagSelectorProps {
  value: Eventful.ID[]
  onChange: (v: Eventful.ID[]) => void
}

export const TagSelector = ({ value: _value, onChange }: TagSelectorProps) => {
  const { session } = useSession()
  const { data: tags } = useTags({ user: session?._id })
  const [value, setValue] = useState<Eventful.API.TagGet[]>([])
  const [menuVisible, setMenuVisible] = useState(false)

  const addTag = useCallback(
    (tag: Eventful.API.TagGet) => {
      const newValue = [...value, tag]
      setValue(newValue)
      onChange(newValue.map((t) => t._id))
    },
    [tags, value]
  )

  const removeTag = useCallback(
    (tag: Eventful.API.TagGet) => {
      const newValue = value.filter((t) => t._id !== tag._id)
      setValue(newValue)
      onChange(newValue.map((t) => t._id))
    },
    [tags, value]
  )

  useEffect(() => {
    setValue(tags?.filter((t) => _value.includes(t._id)) ?? [])
  }, [_value, tags])

  return (
    <>
      <Button
        mode="outlined"
        onPress={() => setMenuVisible(true)}
        icon={(props) => <Feather {...props} name="box" />}
      >
        {!!value.length ? value.map((tag) => tag.name).join(', ') : 'Add tag'}
      </Button>
      <Portal>
        <Dialog visible={menuVisible} onDismiss={() => setMenuVisible(false)}>
          <Dialog.ScrollArea>
            <ScrollView style={[s.c]}>
              {tags?.map((tag) => (
                <List.Item
                  key={tag._id.toString()}
                  left={(props) => (
                    <Checkbox
                      {...props}
                      status={value.find((t) => t._id === tag._id) ? 'checked' : 'unchecked'}
                    />
                  )}
                  onPress={() =>
                    value.some((t) => t._id === tag._id) ? removeTag(tag) : addTag(tag)
                  }
                  title={tag.name}
                />
              ))}
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={() => setMenuVisible(false)}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  )
}
