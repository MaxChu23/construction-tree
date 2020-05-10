import Link from './link'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { findTreeLink, sortLink, updateLink } from '../utils'

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  position: relative;

  @keyframes hasItemsAnimation {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(0.9);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes hasNoItems {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0.9);
    }
  }

  @keyframes button-hide {
    0% {
      transform: translateX(0);
      opacity: 1;
    }
    100% {
      transform: translateX(-20px);
      opacity: 0;
    }
  }

  @keyframes button-show {
    0% {
      transform: translateX(-20px);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes green-square {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`

const Tree = ({ initialData }) => {
  const [treeData, setTreeData] = useState(initialData || {})
  const [renaming, setRenaming] = useState(null)
  const [isDraggingProp, setIsDraggingProp] = useState(false)

  // const moveItemTimer = useRef(null)

  const moveItem = useCallback(
    (id, afterId, nodeId) => {
      if (id === afterId) return
      const link = findTreeLink({ items: treeData, id }).item
      var newTreeData = sortLink(treeData, link, afterId, nodeId)
      if (nodeId) {
        const nodeLink = findTreeLink({ items: newTreeData, id: nodeId }).item
        newTreeData = updateLink(newTreeData, nodeLink, { expanded: true })
      }
      setTreeData(newTreeData)
    },
    [treeData]
  )

  return (
    <Container>
      {treeData.map(branch => (
        <Link
          isDraggingProp={isDraggingProp}
          isPrimary
          key={branch.id}
          link={branch}
          moveItem={moveItem}
          parent={null}
          renaming={renaming}
          setIsDraggingProp={setIsDraggingProp}
          setRenaming={setRenaming}
          setTreeData={setTreeData}
          treeData={treeData}
        />
      ))}
    </Container>
  )
}

export default Tree
