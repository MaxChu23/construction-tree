import update from 'immutability-helper'
import { unflatten } from 'flatulence'

const findTreeLink = ({ id, items }) => {
  var n = items.length
  for (var i = 0; i < n; i++) {
    if (items[i].id === id) {
      return { items, item: items[i] }
    }
    if (items[i].items) {
      const found = findTreeLink({ id, items: items[i].items })
      if (found) {
        return found
      }
    }
  }
}

const findDeepIndexById = ({ items, id }) => {
  var n = items.length
  for (var i = 0; i < n; i++) {
    if (items[i].id === id) {
      return i.toString()
    }
    if (items[i].items) {
      var foundIndex = findDeepIndexById({ items: items[i].items, id })

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

const sortLink = (treeData, link, afterId, nodeId) => {
  const treeWithoutLink = deleteLinkOperation(treeData, link)
  const targetSequence = nodeId ? findDeepIndexById({ items: treeWithoutLink, id: nodeId }) : '0'

  if (afterId) {
    const afterIndex = findDeepIndexById({ items: treeData, id: afterId }).split('.').pop()
    return update(treeWithoutLink, unflatten({ [targetSequence + '.items.$splice']: [[afterIndex, 0, link]] }))
  }
  return update(treeWithoutLink, unflatten({ [targetSequence + '.items.$push']: [link] }))
}

const sortProp = (treeData, link, prop, hoverIndex) => {
  const sequence = findDeepIndexById({ items: treeData, id: link.id })

  const external = link.id !== prop.link.id

  const propObject = (external ? prop.link : link).properties.find(linkProp => linkProp.id === prop.id)

  if (!propObject) {
    return treeData
  }

  const value = !external
    ? [
        [prop.index, 1],
        [hoverIndex, 0, propObject],
      ]
    : [[hoverIndex, 0, propObject]]

  const safeTree = !link.properties
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
    return deleteProp(newTreeData, prop.link, prop.id)
  } else {
    return newTreeData
  }
}

// ------------------------------
// ------------------------------
// ------------------------------

const addItemToLink = (treeData, link, item) => {
  var deepIndex = findDeepIndexById({ items: treeData, id: link.id })

  const newTreeData = update(
    update(
      treeData,
      unflatten({
        [deepIndex + '.items.$push']: [item],
      })
    ),
    unflatten({
      [deepIndex + '.$merge']: { expanded: true },
    })
  )

  return newTreeData
}

const deleteLinkOperation = (treeData, link) => {
  var deepIndex = findDeepIndexById({ items: treeData, id: link.id })

  const { ext, lastItem } = getSplitFromSequence(deepIndex)

  const newTreeData = update(
    treeData,
    unflatten({
      [ext.join('.') + '.$splice']: [[lastItem, 1]],
    })
  )

  return newTreeData
}

const addProp = (treeData, link, prop, index) => {
  var sequence = findDeepIndexById({ items: treeData, id: link.id })

  const newProp = { ...prop }

  if (!newProp.id) {
    newProp.id = link.id + '.' + (link.properties ? link.properties.length : 0) + 1
  }

  const command = {
    [sequence + '.properties' + (index ? '.$splice' : '.$push')]: [index ? [index, 0, newProp] : newProp],
  }

  const safeTree = !link.properties
    ? update(
        treeData,
        unflatten({
          [sequence + '.$merge']: { properties: [] },
        })
      )
    : treeData

  return { treeData: update(safeTree, unflatten(command)), prop: newProp }
}

const deleteProp = (treeData, link, propId) => {
  var sequence = findDeepIndexById({ items: treeData, id: link.id })

  const propIndex = link.properties.findIndex(prop => prop.id === propId)

  if (propIndex === -1) return treeData

  return update(
    treeData,
    unflatten({
      [sequence + '.properties.$splice']: [[propIndex, 1]],
    })
  )
}

const updateLink = (treeData, link, fieldsToChange) => {
  var deepIndex = findDeepIndexById({ items: treeData, id: link.id })

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
  findTreeLink,
  isTextSelected,
  findItem,
  addItemToLink,
  deleteLinkOperation,
  addProp,
  deleteProp,
  updateLink,
  sortLink,
  sortProp,
}
