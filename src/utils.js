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

export { findTreeLink }
