import HTML5Backend from 'react-dnd-html5-backend'
import initialData from '../initial-data'
import React from 'react'
import { DndProvider } from 'react-dnd'
import { Tree } from '../components'

const TreePage = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Tree initialData={initialData} />
    </DndProvider>
  )
}

export default TreePage
