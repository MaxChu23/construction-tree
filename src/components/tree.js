import Link from './link'
import React, { useCallback, useState } from 'react'
import { findTreeLink, sortLink, updateLink } from '../utils'

const Tree = ({ treeData, setTreeData }) => {
  const [renaming, setRenaming] = useState(null)
  const [draggingItem, setDraggingItem] = useState(null)

  // const moveItemTimer = useRef(null)

  const moveItem = useCallback(
    (id, afterId, nodeId) => {
      if (id === afterId) return
      const link = findTreeLink({ items: treeData, id }).item
      var newTreeData = sortLink(treeData, link, afterId, nodeId)
      if (nodeId) {
        const nodeLink = findTreeLink({ items: newTreeData, id: nodeId }).item
        newTreeData = updateLink(newTreeData, nodeLink, { expanded: true })
      }
      setTreeData(newTreeData)
    },
    [treeData, setTreeData]
  )

  return treeData.map(branch => (
    <Link
      draggingItem={draggingItem}
      isPrimary
      key={branch.id}
      link={branch}
      moveItem={moveItem}
      parent={null}
      renaming={renaming}
      setDraggingItem={setDraggingItem}
      setRenaming={setRenaming}
      setTreeData={setTreeData}
      treeData={treeData}
    />
  ))
}

export default Tree
