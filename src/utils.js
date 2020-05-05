const findTreeLink = ({ id, items }) => {
  var n = items.length
  for (var i = 0; i < n; i++) {
    if (items[i].id === id) {
      return { items, item: items[i] }
    } else if (items[i].items) {
      const found = findTreeLink({ id, items: items[i].items })
      if (found) {
        return { items: found.items, item: found.item }
      }
    }
  }
}

const isTextSelected = input => {
  if (typeof input.selectionStart == 'number') {
    return input.selectionStart === 0 && input.selectionEnd === input.value.length
  } else if (typeof document.selection != 'undefined') {
    input.focus()
    return document.selection.createRange().text === input.value
  }
}

export { findTreeLink, isTextSelected }
