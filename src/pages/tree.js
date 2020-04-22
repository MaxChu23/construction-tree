import React from 'react'
import initialData from '../initial-data'
import { Tree } from '../components'

const TreePage = () => {
  return(
    <>
      <Tree initialData={initialData} />
    </>
  )
}

export default TreePage
