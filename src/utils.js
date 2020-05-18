import update from 'immutability-helper'
import { unflatten } from 'flatulence'

const findTreeItem = ({ id, items }) => {
  var n = items.length
  for (var i = 0; i < n; i++) {
    if (items[i].id === id) {
      return { items, item: items[i] }
    }
    if (items[i].items) {
      const found = findTreeItem({ id, items: items[i].items })
      if (found) {
        return found
      }
    }
  }
}

const findSequence = ({ items, id }) => {
  var n = items.length
  for (var i = 0; i < n; i++) {
    if (items[i].id === id) {
      return i.toString()
    }
    if (items[i].items) {
      var foundIndex = findSequence({ items: items[i].items, id })

      if (foundIndex !== -1) {
        const sequence = `${i}.items`
        return `${sequence}.${foundIndex}`
      }
    }
  }
  return -1
}

const findItem = (id, items) => {
  for (const node of items) {
    if (node.id === id) return node
    if (node.items && node.items.length) {
      const result = findItem(id, node.items)
      if (result) {
        return result
      }
    }
  }
  return false
}

const getSplitFromSequence = sequence => {
  const ext = sequence.split('.')
  const lastItem = ext.pop()
  return { ext, lastItem }
}

const sortItems = (treeData, item, afterId, nodeId) => {
  const treeWithoutItem = deleteItemOperation(treeData, item)
  const targetSequence = nodeId ? findSequence({ items: treeWithoutItem, id: nodeId }) : '0'

  if (afterId) {
    const afterIndex = findSequence({ items: treeData, id: afterId }).split('.').pop()
    return update(treeWithoutItem, unflatten({ [targetSequence + '.items.$splice']: [[afterIndex, 0, item]] }))
  }
  return update(treeWithoutItem, unflatten({ [targetSequence + '.items.$push']: [item] }))
}

const sortProp = (treeData, item, prop, hoverIndex) => {
  const sequence = findSequence({ items: treeData, id: item.id })

  const external = item.id !== prop.item.id

  const propObject = (external ? prop.item : item).properties.find(itemProp => itemProp.id === prop.id)

  if (!propObject) {
    return treeData
  }

  const value = !external
    ? [
        [prop.index, 1],
        [hoverIndex, 0, propObject],
      ]
    : [[hoverIndex, 0, propObject]]

  const safeTree = !item.properties
    ? update(
        treeData,
        unflatten({
          [sequence + '.$merge']: { properties: [] },
        })
      )
    : treeData

  const newTreeData = update(
    safeTree,
    unflatten({
      [sequence + '.properties.$splice']: value,
    })
  )

  if (external) {
    return deleteProp(newTreeData, prop.item, prop.id)
  } else {
    return newTreeData
  }
}

// ------------------------------
// ------------------------------
// ------------------------------

const addChild = (treeData, item, itemToAdd) => {
  var deepIndex = findSequence({ items: treeData, id: item.id })

  const newTreeData = update(
    update(
      treeData,
      unflatten({
        [deepIndex + '.items.$push']: [itemToAdd],
      })
    ),
    unflatten({
      [deepIndex + '.$merge']: { expanded: true },
    })
  )

  return newTreeData
}

const deleteItemOperation = (treeData, item) => {
  var deepIndex = findSequence({ items: treeData, id: item.id })

  const { ext, lastItem } = getSplitFromSequence(deepIndex)

  const newTreeData = update(
    treeData,
    unflatten({
      [ext.join('.') + '.$splice']: [[lastItem, 1]],
    })
  )

  return newTreeData
}

const addProp = (treeData, item, prop, index) => {
  var sequence = findSequence({ items: treeData, id: item.id })

  const newProp = { ...prop }

  if (!newProp.id) {
    newProp.id = item.id + '.' + (item.properties ? item.properties.length : 0) + 1
  }

  const command = {
    [sequence + '.properties' + (index ? '.$splice' : '.$push')]: [index ? [index, 0, newProp] : newProp],
  }

  const safeTree = !item.properties
    ? update(
        treeData,
        unflatten({
          [sequence + '.$merge']: { properties: [] },
        })
      )
    : treeData

  return { treeData: update(safeTree, unflatten(command)), prop: newProp }
}

const deleteProp = (treeData, item, propId) => {
  var sequence = findSequence({ items: treeData, id: item.id })

  const propIndex = item.properties.findIndex(prop => prop.id === propId)

  if (propIndex === -1) return treeData

  return update(
    treeData,
    unflatten({
      [sequence + '.properties.$splice']: [[propIndex, 1]],
    })
  )
}

const updateItem = (treeData, item, fieldsToChange) => {
  var deepIndex = findSequence({ items: treeData, id: item.id })

  const newTreeData = update(
    treeData,
    unflatten({
      [deepIndex + '.$merge']: fieldsToChange,
    })
  )

  return newTreeData
}

const isTextSelected = input => {
  if (typeof input.selectionStart === 'number') {
    return input.selectionStart === 0 && input.selectionEnd === input.value.length
  } else if (typeof document.selection != 'undefined') {
    input.focus()
    return document.selection.createRange().text === input.value
  }
}

export {
  findTreeItem,
  isTextSelected,
  findItem,
  addChild,
  deleteItemOperation,
  addProp,
  deleteProp,
  updateItem,
  sortItems,
  sortProp,
}
