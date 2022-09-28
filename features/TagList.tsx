import React from 'react'
import { View, ViewProps } from 'react-native'
import { Caption } from 'react-native-paper'
import { Eventful } from 'types'

interface TagListProps extends ViewProps {
  tags: Eventful.Tag[]
}

export const TagList = ({ tags, ...props }: TagListProps) => (
  <View {...props}>
    {tags.map((tag) => (
      <Caption key={tag._id.toString()} style={{ color: tag.color, margin: 0 }}>
        {`#${tag.name}`}
      </Caption>
    ))}
  </View>
)
