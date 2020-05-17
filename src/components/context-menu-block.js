import ContextMenu from './context-menu'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { addItemToLink, deleteLinkOperation } from '../utils'

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
  link,
  setRenaming,
  treeData,
  setTreeData,
  addLinkProp,
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

  const addLink = useCallback(() => {
    const item = newItemDefaultState
    item.id = link.id + '.' + link.items.length

    setTreeData(addItemToLink(treeData, link, item))
    setRenaming({ id: item.id, type: 'type', value: '' })
    toggleShowContextMenu()
  }, [link, setTreeData, treeData, toggleShowContextMenu, setRenaming])

  const deleteLink = useCallback(() => {
    setTreeData(deleteLinkOperation(treeData, link))
    toggleShowContextMenu()
  }, [link, setTreeData, treeData, toggleShowContextMenu])

  const contextMenuPositionStyle = useMemo(() => {
    if (!showContextMenu) return
    if (!buttonsLauncherRef || !buttonsLauncherRef.current) return {}
    const result = {}
    const clientRect = buttonsLauncherRef.current.getBoundingClientRect()
    const contextMenuExceedsWidth = clientRect.x + 100 - window.innerWidth > 0
    const contextMenuExceedsHeight = clientRect.y + 100 - window.innerHeight > 0

    if (contextMenuExceedsWidth) {
      result.right = 100
    } else {
      result.left = clientRect.x
    }

    if (contextMenuExceedsHeight) {
      result.bottom = 100
    } else {
      result.top = clientRect.y
    }

    return result
  }, [showContextMenu, buttonsLauncherRef])

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
      const newProp = addLinkProp(prop)
      setChangingProperty(newProp)
    },
    [addLinkProp, setChangingProperty]
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
        return deleteLink()
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
        return addLink()
      }
    },
    [addPropAndChange, deleteLink, toggleChangeName, toggleChangeType, addLink]
  )

  return (
    <>
      <MenuLauncher
        className="menu-launcher"
        onClick={toggleShowContextMenu}
        ref={buttonsLauncherRef}
        showContextMenu={showContextMenu}
      />
      <ContextMenu
        clickMenuButton={clickMenuButton}
        content={contextMenuContent}
        contextMenuPositionStyle={contextMenuPositionStyle}
        setShow={setShowContextMenu}
        show={showContextMenu}
      />
    </>
  )
}

export default ContextMenuBlock
