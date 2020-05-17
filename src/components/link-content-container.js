import Content from './link-content'
import ContextMenuBlock from './context-menu-block'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { addProp, deleteProp, updateLink } from '../utils'

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

const LinkContentContainer = ({
  treeData,
  link,
  renaming,
  setRenaming,
  setTreeData,
  initialAnimation,
  setDraggingItem,
}) => {
  const [changingProperty, setChangingProperty] = useState(null)

  const addLinkProp = useCallback(
    (prop, index) => {
      const result = addProp(treeData, link, prop, index)
      setTreeData(result.treeData)
      return result.prop
    },
    [link, treeData, setTreeData]
  )

  const deleteLinkProp = useCallback(
    propId => {
      setTreeData(deleteProp(treeData, link, propId))
    },
    [setTreeData, treeData, link]
  )

  const handleExpand = useCallback(() => {
    setTreeData(updateLink(treeData, link, { expanded: !link.expanded }))
  }, [link, treeData, setTreeData])

  const renameLink = useCallback(
    event => {
      if (!renaming) return

      const fieldsToChange = { [renaming.type]: event.target.value }
      setRenaming(renaming.type === 'type' && link.name === '' ? { id: link.id, type: 'name', value: '' } : null)

      const newTreeData = updateLink(treeData, link, fieldsToChange)

      setTreeData(newTreeData)
    },
    [renaming, link, treeData, setTreeData, setRenaming]
  )

  const toggleChangeName = useCallback(() => {
    setRenaming({ id: link.id, type: 'name', value: link.name })
  }, [setRenaming, link.id, link.name])

  const toggleChangeType = useCallback(() => {
    setRenaming({ id: link.id, type: 'type', value: link.type })
  }, [setRenaming, link.id, link.type])

  const onInputKeyDown = useCallback(
    event => {
      if (event.key === 'Enter') {
        renameLink(event)
      }
    },
    [renameLink]
  )

  const onInputChange = useCallback(
    event => {
      setRenaming({ ...renaming, value: event.target.value })
    },
    [renaming, setRenaming]
  )

  return (
    <Container expanded={initialAnimation && link.expanded && link.items.length > 1}>
      <Content
        addLinkProp={addLinkProp}
        changingProperty={changingProperty}
        deleteLinkProp={deleteLinkProp}
        link={link}
        onInputChange={onInputChange}
        onInputKeyDown={onInputKeyDown}
        renameLink={renameLink}
        renaming={renaming}
        setChangingProperty={setChangingProperty}
        setDraggingItem={setDraggingItem}
        setTreeData={setTreeData}
        toggleChangeName={toggleChangeName}
        toggleChangeType={toggleChangeType}
        treeData={treeData}
      />
      <ContextMenuBlock
        addLinkProp={addLinkProp}
        link={link}
        setChangingProperty={setChangingProperty}
        setRenaming={setRenaming}
        setTreeData={setTreeData}
        toggleChangeName={toggleChangeName}
        toggleChangeType={toggleChangeType}
        treeData={treeData}
      />
      {link.items.length > 0 && (
        <HasItemsIndicator expanded={link.expanded} onClick={handleExpand}>
          <span />
        </HasItemsIndicator>
      )}
    </Container>
  )
}

export default LinkContentContainer
