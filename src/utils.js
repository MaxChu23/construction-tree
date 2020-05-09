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

const isTextSelected = input => {
  if (typeof input.selectionStart === 'number') {
    return input.selectionStart === 0 && input.selectionEnd === input.value.length
  } else if (typeof document.selection != 'undefined') {
    input.focus()
    return document.selection.createRange().text === input.value
  }
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

const removeNode = (id, items) => {
  for (const node of items) {
    if (node.id === id) {
      items.splice(items.indexOf(node), 1)
      return
    }

    if (node.items && node.items.length) {
      removeNode(id, node.items)
    }
  }
}

const getSplitFromSequence = sequence => {
  const ext = sequence.split('.')
  const lastItem = ext.pop()
  return { ext, lastItem }
}

const sortLink = (treeData, link, afterId, nodeId) => {
  const treeWithoutLink = deleteLinkOperation(treeData, link)
  const targetSequence = nodeId ? findDeepIndexById({ items: treeWithoutLink, id: nodeId }) + '.items' : '0.items'

  if (afterId) {
    const afterIndex = findDeepIndexById({ items: treeData, id: afterId }).split('.').pop()
    return update(treeWithoutLink, unflatten({ [targetSequence + '.$splice']: [[afterIndex, 0, link]] }))
  }
  return update(treeWithoutLink, unflatten({ [targetSequence + '.$push']: [link] }))
}

/*
(id, afterId, nodeId) => {
  if (id === afterId) return
  const newTreeData = [...treeData]

  const item = { ...findItem(id, newTreeData) }
  if (!item.id) {
    return
  }

  const destination = nodeId ? findItem(nodeId, newTreeData).items : newTreeData

  if (!afterId) {
    removeNode(id, newTreeData)
    destination.push(item)
  } else {
    const index = destination.indexOf(destination.filter(destinationItem => destinationItem.id === afterId).shift())
    removeNode(id, newTreeData)
    destination.splice(index, 0, item)
  }

  setTreeData(newTreeData)
},
*/

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
  const newTreeData = [...treeData]

  var newLink = findTreeLink({ items: newTreeData, id: link.id })
  if (!newLink) return treeData

  const newLinkProp = { ...prop }
  const props = newLink.item.properties || []

  if (!newLinkProp.id) {
    newLinkProp.id = props.length + 1
  }

  if (index) {
    newLink.item.properties.splice(index, 0, newLinkProp)
  } else {
    newLink.item.properties = [...props, newLinkProp]
  }

  return newTreeData
}

const deleteProp = (treeData, link, propId) => {
  const newTreeData = [...treeData]

  var newLink = findTreeLink({ items: newTreeData, id: link.id })
  if (!newLink) return treeData
  var newLinkPropIndex = newLink.item.properties.findIndex(item => item.id === propId)
  if (newLinkPropIndex === -1) return treeData

  newLink.item.properties.splice(newLinkPropIndex, 1)
  return newTreeData
}

const updateLink = (treeData, link, fieldsToChange) => {
  var deepIndex = findDeepIndexById({ items: treeData, id: link.id }) + '.$merge'

  const newTreeData = update(
    treeData,
    unflatten({
      [deepIndex]: fieldsToChange,
    })
  )

  return newTreeData
}

export {
  findTreeLink,
  isTextSelected,
  findItem,
  removeNode,
  addItemToLink,
  deleteLinkOperation,
  addProp,
  deleteProp,
  updateLink,
  sortLink,
}
