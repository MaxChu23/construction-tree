import React, { useState } from 'react'
import styled from 'styled-components'
import Link from './link'

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
`

const Tree = ({ initialData }) => {
  const [treeData, setTreeData] = useState(initialData || {})
  const [renaming, setRenaming] = useState(null)

  return(
    <Container>
      {treeData.map(branch => (
        <Link isPrimary renaming={renaming} setRenaming={setRenaming} setTreeData={setTreeData} treeData={treeData} link={branch} key={branch.id} ></Link>
      ))}
    </Container>
  )
}

export default Tree
