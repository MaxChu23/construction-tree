import Content from './content'
import ContextMenuBlock from './context-menu-block'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { addProp, deleteProp, updateItem } from '../../utils'

const Container = styled.div`
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    width: 1px;
    height: 30px;
    background: #777;
    transition: transform 0.2s ease-in;
    transform: scaleY(${({ expanded }) => (expanded ? 1 : 0)});
    transform-origin: top;
  }

  &:hover {
    .menu-launcher {
      transform: scale(1);
      opacity: 1;
    }
  }
`

const HasItemsIndicator = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
  cursor: pointer;
  height: 20px;

  span {
    display: block;
    width: 14px;
    height: 14px;
    margin: 0 auto;
    user-select: none;
    background: #fff;
    border-radius: 50%;
    text-align: center;

    transition: 0.3s all;

    ${({ expanded }) =>
      expanded
        ? `
      animation: 0.6s hasNoItems;
      animation-fill-mode: forwards;
      color: #777;
      border: 1px solid #777;
    `
        : `
      color: #0bf;
      border: 1px solid rgba(100, 200, 255, 0.5);
      box-shadow: 0px 0px 5px 1px rgba(100, 200, 255, 0.5);
      animation: 1.2s hasItemsAnimation infinite;
    `}

    &::before {
      content: '';
      position: absolute;
      top: 2px;
      bottom: 2px;
      width: 1px;
      left: 50%;
      background: #777;
      transition: transform 0.3s;
      transform: translateX(-50%) scale(${({ expanded }) => (expanded ? 0 : 1)});
    }

    &::after {
      content: '';
      position: absolute;
      left: 2px;
      right: 2px;
      top: 50%;
      height: 1px;
      background: #777;
      transform: translateY(-50%);
    }
  }
`

const ContentContainer = ({ treeData, item, renaming, setRenaming, setTreeData, animate, setDraggingItem }) => {
  const [changingProperty, setChangingProperty] = useState(null)

  const addItemProp = useCallback(
    (prop, index) => {
      const result = addProp(treeData, item, prop, index)
      setTreeData(result.treeData)
      return result.prop
    },
    [item, treeData, setTreeData]
  )

  const deleteItemProp = useCallback(
    propId => {
      setTreeData(deleteProp(treeData, item, propId))
    },
    [setTreeData, treeData, item]
  )

  const handleExpand = useCallback(() => {
    setTreeData(updateItem(treeData, item, { expanded: !item.expanded }))
  }, [item, treeData, setTreeData])

  const renameItem = useCallback(
    event => {
      if (!renaming) return

      const fieldsToChange = { [renaming.type]: event.target.value }
      const continueRenaming =
        (renaming.type === 'type' && (item.name === '' || (event.keyCode === 9 && !event.shiftKey))) ||
        (renaming.type === 'name' && event.keyCode === 9 && event.shiftKey)

      const continueType = renaming.type === 'type' ? 'name' : 'type'
      setRenaming(continueRenaming ? { id: item.id, type: continueType, value: item[continueType] } : null)

      const newTreeData = updateItem(treeData, item, fieldsToChange)

      setTreeData(newTreeData)
    },
    [renaming, item, treeData, setTreeData, setRenaming]
  )

  const toggleChangeName = useCallback(() => {
    setRenaming({ id: item.id, type: 'name', value: item.name })
  }, [setRenaming, item.id, item.name])

  const toggleChangeType = useCallback(() => {
    setRenaming({ id: item.id, type: 'type', value: item.type })
  }, [setRenaming, item.id, item.type])

  const onInputKeyDown = useCallback(
    event => {
      if (event.keyCode === 13 || event.keyCode === 9) {
        event.preventDefault()
        renameItem(event)
      }
    },
    [renameItem]
  )

  const onInputChange = useCallback(
    event => {
      setRenaming({ ...renaming, value: event.target.value })
    },
    [renaming, setRenaming]
  )

  return (
    <Container expanded={animate && item.expanded && item.items.length > 1}>
      <Content
        addItemProp={addItemProp}
        changingProperty={changingProperty}
        deleteItemProp={deleteItemProp}
        item={item}
        onInputChange={onInputChange}
        onInputKeyDown={onInputKeyDown}
        renameItem={renameItem}
        renaming={renaming}
        setChangingProperty={setChangingProperty}
        setDraggingItem={setDraggingItem}
        setTreeData={setTreeData}
        toggleChangeName={toggleChangeName}
        toggleChangeType={toggleChangeType}
        treeData={treeData}
      />
      <ContextMenuBlock
        addItemProp={addItemProp}
        item={item}
        setChangingProperty={setChangingProperty}
        setRenaming={setRenaming}
        setTreeData={setTreeData}
        toggleChangeName={toggleChangeName}
        toggleChangeType={toggleChangeType}
        treeData={treeData}
      />
      {item.items.length > 0 && (
        <HasItemsIndicator expanded={item.expanded} onClick={handleExpand}>
          <span />
        </HasItemsIndicator>
      )}
    </Container>
  )
}

export default ContentContainer
