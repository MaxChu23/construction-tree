import LinkContent from './link-content'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { findItem } from '../utils'
import { useDrag, useDrop } from 'react-dnd'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  outline: none;
  position: relative;

  opacity: ${({ initialAnimation }) => (initialAnimation ? 1 : 0)};
  transform: translateY(${({ initialAnimation }) => (initialAnimation ? 0 : 10)}px);
  transition: all 0.3s;

  ${({ isFirst, isPrimary }) =>
    !isFirst &&
    !isPrimary &&
    `
      margin-left: 10px;
    `}

  ${({ isPrimary, isLast, isFirst, initialAnimation }) =>
    !isPrimary &&
    `
    margin-top: 50px;
    &::before {
      content: '';
      position: absolute;
      top: ${isFirst && isLast ? '-50px' : '-20px'};
      width: 1px;
      height: ${isFirst && isLast ? '50px' : '20px'};
      background: #777;
      transition: transform 0.2s ${isFirst && isLast ? '' : '0.4s'} ease-out;
      transform: scaleY(${initialAnimation ? 1 : 0});
      transform-origin: top;
    }
    ${
      !(isLast && isFirst)
        ? `

      &::after {
        content: '';
        position: absolute;
        top: -20px;
        left: ${isLast ? 0 : !isFirst ? '0' : '50%'};
        right: ${isLast ? '50%' : '-10px'};
        height: 1px;
        background: #777;
        transition: transform 0.2s 0.2s linear;
        transform: scaleX(${initialAnimation ? 1 : 0});
        transform-origin: ${isLast ? 'left' : 'right'};
      }
      `
        : ''
    }
  `}
`

const ContainerPos = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  outline: none;
  position: relative;
`

const ItemsContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;

  min-height: 10px;
  width: calc(100% + 15px);
  padding-top: 10px;
  margin-top: -11px;
`

const ItemsTree = ({ link, moveItem, renaming, setRenaming, treeData, setTreeData, parentId }) => {
  const [{}, dropRef] = useDrop({
    accept: 'item',
    hover: (draggedItem, monitor) => {
      if (!monitor.isOver({ shallow: true })) return

      const descendantNode = findItem(parentId, draggedItem.items)
      if (descendantNode) return
      if (draggedItem.parentId == parentId || draggedItem.id == parentId) return

      moveItem(draggedItem.id, undefined, parentId)
    },
  })

  return (
    <ItemsContainer ref={dropRef}>
      {link.expanded &&
        link.items.map((branch, branchIndex) => (
          <Link
            isFirst={branchIndex === 0}
            isLast={branchIndex === link.items.length - 1}
            key={branch.id}
            link={branch}
            moveItem={moveItem}
            parentId={parentId}
            renaming={renaming}
            setRenaming={setRenaming}
            setTreeData={setTreeData}
            treeData={treeData}
          />
        ))}
    </ItemsContainer>
  )
}

const Link = ({
  link,
  treeData,
  setTreeData,
  isPrimary,
  isLast,
  renaming,
  setRenaming,
  isFirst,
  moveItem,
  parentId,
}) => {
  const [initialAnimation, setInitialAnimation] = useState(false)

  const animationTimer = useRef(null)

  useEffect(() => {
    animationTimer.current = setTimeout(() => {
      setInitialAnimation(true)
    }, 50)
    return () => clearTimeout(animationTimer.current)
  }, [])

  const [, dropRef] = useDrop({
    accept: 'item',
    canDrop: false,
    hover: (draggedItem, monitor) => {
      if (draggedItem.id === link.id || draggedItem.id === parentId) return
      if (!monitor.isOver({ shallow: true })) return

      moveItem(draggedItem.id, link.id, parentId)
    },
  })

  const [, dragRef] = useDrag({
    item: {
      id: link.id,
      parentId,
      items: link.items,
      type: 'item',
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging() && link.id === monitor.getItem().id,
    }),
  })

  return (
    <Container initialAnimation={initialAnimation} isFirst={isFirst} isLast={isLast} isPrimary={isPrimary}>
      <ContainerPos isFirst={isFirst} isPrimary={isPrimary} ref={dropRef}>
        <div ref={dragRef}>
          <LinkContent
            initialAnimation={initialAnimation}
            link={link}
            renaming={renaming}
            setRenaming={setRenaming}
            setTreeData={setTreeData}
            treeData={treeData}
          />
        </div>
        <ItemsTree
          link={link}
          moveItem={moveItem}
          parentId={link.id}
          renaming={renaming}
          setRenaming={setRenaming}
          setTreeData={setTreeData}
          treeData={treeData}
        />
      </ContainerPos>
    </Container>
  )
}

export default Link
