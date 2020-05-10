import LinkContent from './link-content'
import React, { useEffect, useMemo, useRef, useState } from 'react'
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

const DropContainer = styled.div`
  position: absolute;
  top: 0;
  left: -20px;
  right: -20px;
  bottom: 0;
  border: 1px dotted #f00;
  background: rgba(255, 0, 0, 0.1);
  z-index: ${({ isDraggingProp }) => (isDraggingProp ? -1 : 1)};
`

const ContainerPos = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  outline: none;
  position: relative;

  &:hover {
    > div:first-child > div:first-child {
      z-index: -1;
    }
  }
`

const ItemsContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;

  width: 100%;
`

const ItemsDropContainer = styled.div`
  position: absolute;
  height: 20px;
  width: 40px;
  left: 50%;
  bottom: -40px;
  transform: translateX(-50%);
  /* border: 1px dotted #0f0; */
  z-index: 12;
`

const DragContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  justify-content: center;

  &:hover {
    ${ItemsDropContainer} {
      z-index: 0;
    }
  }
`

const GreenSquare = styled.div`
  position: absolute;
  top: -25px;
  left: -25px;
  right: -25px;
  bottom: -25px;
  border: 2px dashed #05814bb5;
  box-shadow: inset 0px 0px 30px rgba(0, 255, 135, 0.59);
  /* background: radial-gradient(rgba(255, 255, 255, 0),rgba(0, 255, 55, 0.3)); */
  border-radius: 10px;
  z-index: 50;
  pointer-events: none;
  opacity: 0;

  ${({ show }) => show && 'animation: green-square 1s infinite linear;'}
`

const GreenSquareEffect = ({ active }) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!active) {
      setShow(false)
    } else {
      setShow(true)
    }
  }, [active])

  return <GreenSquare show={show} />
}

const ItemsTree = ({
  link,
  moveItem,
  renaming,
  setRenaming,
  treeData,
  setTreeData,
  setIsDraggingProp,
  isDraggingProp,
}) => {
  return (
    <ItemsContainer>
      {link.expanded &&
        link.items.map((branch, index) => (
          <Link
            index={index}
            isDraggingProp={isDraggingProp}
            key={branch.id}
            link={branch}
            moveItem={moveItem}
            parent={link}
            renaming={renaming}
            setIsDraggingProp={setIsDraggingProp}
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
  renaming,
  setRenaming,
  moveItem,
  parent,
  index,
  isDraggingProp,
  setIsDraggingProp,
}) => {
  const [initialAnimation, setInitialAnimation] = useState(false)

  const isFirst = useMemo(() => index === 0, [index])
  const isLast = useMemo(() => parent && index === parent.items.length - 1, [index, parent])

  const animationTimer = useRef(null)
  const dropRefContainer = useRef(null)

  useEffect(() => {
    animationTimer.current = setTimeout(() => {
      setInitialAnimation(true)
    }, 50)
    return () => clearTimeout(animationTimer.current)
  }, [])

  const [{ isOver }, dropRef] = useDrop({
    accept: 'item',
    canDrop: false,
    collect: monitor => {
      return {
        isOver: monitor.isOver({ shallow: true }),
      }
    },
    hover: (draggedItem, monitor) => {
      if (!dropRefContainer.current) return
      if (draggedItem.id === link.id || (parent && draggedItem.id === parent.id)) return
      if (!monitor.isOver({ shallow: true })) return

      const childNode = findItem(link.id, draggedItem.items)
      if (childNode) return

      // calc widths

      const hoverBoundingRect = dropRefContainer.current.getBoundingClientRect()

      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2

      const clientOffset = monitor.getClientOffset()

      const hoverClientX = clientOffset.x - hoverBoundingRect.left
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (draggedItem.index < index && hoverClientX < hoverMiddleX) return
      // Dragging upwards
      if (draggedItem.index > index && hoverClientX > hoverMiddleX) return

      moveItem(draggedItem.id, link.id, parent && parent.id)

      draggedItem.index = index
    },
  })

  const [{ isDragging }, dragRef] = useDrag({
    item: {
      id: link.id,
      parent,
      index,
      items: link.items,
      type: 'item',
    },
    collect: monitor => {
      return {
        isDragging: monitor.isDragging(),
      }
    },
  })

  dropRef(dropRefContainer)

  const [{ isOverSubTree }, itemsDropRef] = useDrop({
    accept: 'item',
    drop: (draggedItem, monitor) => {
      if (!monitor.isOver({ shallow: true })) return

      const descendantNode = findItem(draggedItem.id, link.items)
      if (descendantNode) return
      if ((draggedItem.parent && draggedItem.parent.id === link.id) || draggedItem.id === link.id) return

      moveItem(draggedItem.id, undefined, link.id)
    },
    collect: monitor => {
      const draggedItem = monitor.getItem()
      if (!draggedItem || draggedItem.type !== 'item') return { isOverSubTree: false }
      const descendantNode = findItem(link.id, draggedItem.items)

      const parentOrSelf = (draggedItem.parent && draggedItem.parent.id === link.id) || draggedItem.id === link.id

      const isOverSubTree = monitor.isOver({ shallow: true }) && !descendantNode && !parentOrSelf

      return {
        isOverSubTree,
      }
    },
  })

  return (
    <Container initialAnimation={initialAnimation} isFirst={isFirst} isLast={isLast} isPrimary={isPrimary}>
      <GreenSquareEffect active={isOverSubTree} />
      <ContainerPos isFirst={isFirst} isPrimary={isPrimary}>
        <DragContainer ref={dragRef}>
          <DropContainer isDraggingProp={isDraggingProp} ref={dropRefContainer} />
          <div style={{ position: 'relative' }}>
            <LinkContent
              initialAnimation={initialAnimation}
              link={link}
              renaming={renaming}
              setIsDraggingProp={setIsDraggingProp}
              setRenaming={setRenaming}
              setTreeData={setTreeData}
              treeData={treeData}
            />
            <ItemsDropContainer ref={itemsDropRef} />
          </div>
        </DragContainer>
        <ItemsTree
          isDraggingProp={isDraggingProp}
          link={link}
          moveItem={moveItem}
          parent={link}
          renaming={renaming}
          setIsDraggingProp={setIsDraggingProp}
          setRenaming={setRenaming}
          setTreeData={setTreeData}
          treeData={treeData}
        />
      </ContainerPos>
    </Container>
  )
}

export default Link
