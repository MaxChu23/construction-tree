import HTML5Backend from 'react-dnd-html5-backend'
import initialData from '../initial-data'
import React, { useState } from 'react'
import styled from 'styled-components'
import { BlankState, Sidebar, Tree } from '../components'
import { DndProvider } from 'react-dnd'

const Container = styled.div`
  height: 100%;
  display: flex;
  margin: 0 auto;
  width: 100%;
  overflow: auto;
  position: relative;
  padding: 20px;

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

const TreePage = () => {
  // const [treeData, setTreeData] = useState([])
  const [treeData, setTreeData] = useState(initialData || [])

  if (treeData.length === 0) return <BlankState setTreeData={setTreeData} treeData={treeData} />

  return (
    <DndProvider backend={HTML5Backend}>
      <Sidebar />
      <Container>
        <Tree setTreeData={setTreeData} treeData={treeData} />
      </Container>
    </DndProvider>
  )
}

export default TreePage
