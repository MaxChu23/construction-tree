import Item from './item'
import React, { useCallback, useState } from 'react'
import { findTreeItem, sortItems, updateItem } from '../utils'

const Tree = ({ treeData, setTreeData }) => {
  const [renaming, setRenaming] = useState(null)
  const [draggingItem, setDraggingItem] = useState(null)

  const moveItem = useCallback(
    (id, afterId, nodeId) => {
      if (id === afterId) return
      const item = findTreeItem({ items: treeData, id }).item
      var newTreeData = sortItems(treeData, item, afterId, nodeId)
      if (nodeId) {
        const nodeItem = findTreeItem({ items: newTreeData, id: nodeId }).item
        newTreeData = updateItem(newTreeData, nodeItem, { expanded: true })
      }
      setTreeData(newTreeData)
    },
    [treeData, setTreeData]
  )

  return treeData.map(item => (
    <Item
      draggingItem={draggingItem}
      isPrimary
      item={item}
      key={item.id}
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
