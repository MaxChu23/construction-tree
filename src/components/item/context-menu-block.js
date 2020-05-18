import ContextMenu from './context-menu'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { addChild, deleteItemOperation } from '../../utils'

const MenuLauncher = styled.div`
  outline: none;
  position: absolute;
  top: -4px;
  right: -4px;
  width: 12px;
  height: 12px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #777;
  cursor: pointer;
  transition: all 0.2s;

  z-index: 12;
  opacity: 0;
  transform: scale(0);

  &:hover {
    background: #fb0;
    &::before {
      transform: rotate(0deg) scale(1);
    }
  }

  ${({ showContextMenu }) =>
    showContextMenu &&
    `
    transform: scale(1);
    opacity: 1;
  `}

  &::before {
    content: '';
    position: absolute;
    top: 2px;
    bottom: 2px;
    left: 2px;
    right: 2px;
    background: #333;
    transform: rotate(45deg) scale(0.6);
    transition: transform 0.3s;
  }

  @media (max-width: 960px) {
    opacity: 1;
    transform: scale(1);

    &::before {
      transform: scale(1) rotate(45deg);
    }
  }
`

const contextMenuContent = {
  props: [
    { id: 'add-prop-text', label: 'Text' },
    { id: 'add-prop-boolean', label: 'Boolean' },
    { id: 'prop-cancel', label: 'Cancel', switchToMenu: 'main' },
  ],
  main: [
    { id: 'add-item', label: 'Add Item' },
    { id: 'delete-item', label: 'Delete', confirmationLabel: 'Are you sure?' },
    { id: 'change-item-type', label: 'Change Type' },
    { id: 'change-item-name', label: 'Change Name' },
    { id: 'add-item-property', label: 'Add Property', switchToMenu: 'props' },
  ],
}

const newItemDefaultState = {
  type: '',
  name: '',
  expanded: false,
  items: [],
}

const ContextMenuBlock = ({
  item,
  setRenaming,
  treeData,
  setTreeData,
  addItemProp,
  toggleChangeName,
  toggleChangeType,
  setChangingProperty,
}) => {
  const [showContextMenu, setShowContextMenu] = useState(false)

  const buttonsLauncherRef = useRef(null)
  const blurTimeoutRef = useRef(null)
  const contextMenuTimeout = useRef(null)

  const toggleShowContextMenu = useCallback(() => {
    setShowContextMenu(!showContextMenu)
  }, [setShowContextMenu, showContextMenu])

  const addItem = useCallback(() => {
    const child = newItemDefaultState
    child.id = item.id + '.' + item.items.length

    setTreeData(addChild(treeData, item, child))
    setRenaming({ id: child.id, type: 'type', value: '' })
  }, [item, setTreeData, treeData, setRenaming])

  const deleteItem = useCallback(() => {
    setTreeData(deleteItemOperation(treeData, item))
  }, [item, setTreeData, treeData])

  const addPropAndChange = useCallback(
    type => {
      const defaultValues = {
        text: '',
        boolean: false,
      }

      const prop = {
        type,
        name: '',
        value: defaultValues[type],
      }
      const newProp = addItemProp(prop)
      setChangingProperty(newProp)
    },
    [addItemProp, setChangingProperty]
  )

  useEffect(
    () => () => {
      clearTimeout(contextMenuTimeout.current)
      clearTimeout(blurTimeoutRef.current)
    },
    []
  )

  const clickMenuButton = useCallback(
    buttonId => {
      if (buttonId === 'delete-item') {
        return deleteItem()
      }
      if (buttonId === 'add-prop-text') {
        return addPropAndChange('text')
      }
      if (buttonId === 'add-prop-boolean') {
        return addPropAndChange('boolean')
      }
      if (buttonId === 'change-item-type') {
        return toggleChangeType()
      }
      if (buttonId === 'change-item-name') {
        return toggleChangeName()
      }
      if (buttonId === 'add-item') {
        return addItem()
      }
    },
    [addPropAndChange, deleteItem, toggleChangeName, toggleChangeType, addItem]
  )

  return (
    <>
      <MenuLauncher
        className="menu-launcher"
        onMouseDown={toggleShowContextMenu}
        ref={buttonsLauncherRef}
        showContextMenu={showContextMenu}
      />
      <ContextMenu
        anchorElement={buttonsLauncherRef}
        clickMenuButton={clickMenuButton}
        content={contextMenuContent}
        setShow={setShowContextMenu}
        show={showContextMenu}
      />
    </>
  )
}

export default ContextMenuBlock
