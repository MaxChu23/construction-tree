import ContentContainer from './content-container'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { findItem } from '../../utils'
import { useDrag, useDrop } from 'react-dnd'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  outline: none;
  position: relative;

  opacity: ${({ animate }) => (animate ? 1 : 0)};
  transform: translateY(${({ animate }) => (animate ? 0 : 10)}px);
  transition: all 0.3s;

  &::before,
  &::after {
    content: '';
    position: absolute;
    background: #777;
  }

  ${({ isFirst, isPrimary }) =>
    !isFirst &&
    !isPrimary &&
    `
      margin-left: 10px;
    `}

  ${({ isPrimary, isLast, isFirst, animate }) =>
    !isPrimary
      ? `
    margin-top: 50px;
    &::before {
      top: ${isFirst && isLast ? '-50px' : '-20px'};
      width: 1px;
      height: ${isFirst && isLast ? '50px' : '20px'};
      transition: transform 0.2s ${isFirst && isLast ? '' : '0.4s'} ease-out;
      transform: scaleY(${animate ? 1 : 0});
      transform-origin: top;
    }
    ${
      !(isLast && isFirst)
        ? `
      &::after {
        top: -20px;
        left: ${isLast ? 0 : !isFirst ? '0' : '50%'};
        right: ${isLast ? '50%' : '-10px'};
        height: 1px;
        transition: transform 0.2s 0.2s linear;
        transform: scaleX(${animate ? 1 : 0});
        transform-origin: ${isLast ? 'left' : 'right'};
      }
      `
        : ''
    }
  `
      : 'margin: 0 auto;'}
`

const DropContainer = styled.div`
  position: absolute;
  top: 0;
  left: -20px;
  right: -20px;
  bottom: 0;
  /* border: 1px dotted #f00; */
  /* background: rgba(255, 0, 0, 0.1); */
  z-index: ${({ draggingItem }) => (draggingItem === 'item' ? 1 : -1)};
  ${({ draggingItem }) => !draggingItem && 'pointer-events: none; -webkit-user-drag: none;'};
`

const PositionContainer = styled.div`
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
    setShow(active)
  }, [active])

  return <GreenSquare show={show} />
}

const ItemsTree = ({ item, moveItem, renaming, setRenaming, treeData, setTreeData, setDraggingItem, draggingItem }) => {
  return (
    <ItemsContainer>
      {item.expanded &&
        item.items.map((child, index) => (
          <Item
            draggingItem={draggingItem}
            index={index}
            item={child}
            key={child.id}
            moveItem={moveItem}
            parent={item}
            renaming={renaming}
            setDraggingItem={setDraggingItem}
            setRenaming={setRenaming}
            setTreeData={setTreeData}
            treeData={treeData}
          />
        ))}
    </ItemsContainer>
  )
}

const Item = ({
  item,
  treeData,
  setTreeData,
  isPrimary,
  renaming,
  setRenaming,
  moveItem,
  parent,
  index,
  draggingItem,
  setDraggingItem,
}) => {
  const [animate, setAnimate] = useState(false)

  const isFirst = useMemo(() => index === 0, [index])
  const isLast = useMemo(() => parent && index === parent.items.length - 1, [index, parent])

  const animationTimer = useRef(null)
  const dropRefContainer = useRef(null)

  useEffect(() => {
    animationTimer.current = setTimeout(() => {
      setAnimate(true)
    }, 50)
    return () => clearTimeout(animationTimer.current)
  }, [])

  const [, dropRef] = useDrop({
    accept: 'item',
    canDrop: false,
    hover: (draggedItem, monitor) => {
      if (!dropRefContainer.current) return
      if (draggedItem.id === item.id || (parent && draggedItem.id === parent.id)) return
      if (!monitor.isOver({ shallow: true })) return

      const childNode = findItem(item.id, draggedItem.items)
      if (childNode) return

      const hoverBoundingRect = dropRefContainer.current.getBoundingClientRect()

      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2

      const clientOffset = monitor.getClientOffset()

      const hoverClientX = clientOffset.x - hoverBoundingRect.left

      if (draggedItem.index < index && hoverClientX < hoverMiddleX) return
      if (draggedItem.index > index && hoverClientX > hoverMiddleX) return

      moveItem(draggedItem.id, item.id, parent && parent.id)

      draggedItem.index = index
    },
  })

  const [, dragRef, previewRef] = useDrag({
    item: {
      id: item.id,
      parent,
      index,
      items: item.items,
      type: 'item',
    },
    begin: () => {
      setDraggingItem('item')
    },
    end: () => {
      setDraggingItem(null)
    },
  })

  dropRef(dropRefContainer)

  const [{ isOverSubTree }, itemsDropRef] = useDrop({
    accept: 'item',
    drop: (draggedItem, monitor) => {
      if (!monitor.isOver({ shallow: true })) return

      const childNode = findItem(item.id, draggedItem.items)
      if (childNode) return

      if ((draggedItem.parent && draggedItem.parent.id === item.id) || draggedItem.id === item.id) return

      moveItem(draggedItem.id, undefined, item.id)
    },
    collect: monitor => {
      const draggedItem = monitor.getItem()
      if (!draggedItem || draggedItem.type !== 'item') return { isOverSubTree: false }
      const descendantNode = findItem(item.id, draggedItem.items)

      const parentOrSelf = (draggedItem.parent && draggedItem.parent.id === item.id) || draggedItem.id === item.id

      const isOverSubTree = !descendantNode && !parentOrSelf && monitor.isOver({ shallow: true })

      return {
        isOverSubTree,
      }
    },
  })

  return (
    <Container animate={animate} isFirst={isFirst} isLast={isLast} isPrimary={isPrimary}>
      <GreenSquareEffect active={isOverSubTree} />
      <PositionContainer isFirst={isFirst} isPrimary={isPrimary} ref={previewRef}>
        <DragContainer ref={dragRef}>
          <DropContainer draggingItem={draggingItem} ref={dropRefContainer} />
          <div style={{ position: 'relative' }}>
            <ContentContainer
              animate={animate}
              item={item}
              renaming={renaming}
              setDraggingItem={setDraggingItem}
              setRenaming={setRenaming}
              setTreeData={setTreeData}
              treeData={treeData}
            />
            <ItemsDropContainer ref={itemsDropRef} />
          </div>
        </DragContainer>
        <ItemsTree
          draggingItem={draggingItem}
          item={item}
          moveItem={moveItem}
          parent={item}
          renaming={renaming}
          setDraggingItem={setDraggingItem}
          setRenaming={setRenaming}
          setTreeData={setTreeData}
          treeData={treeData}
        />
      </PositionContainer>
    </Container>
  )
}

export default Item
