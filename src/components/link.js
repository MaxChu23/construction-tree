import LinkContent from './link-content'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  outline: none;
  position: relative;

  opacity: ${({ initialAnimation }) => (initialAnimation ? 1 : 0)};
  transform: translateY(${({ initialAnimation }) => (initialAnimation ? 0 : 10)}px);
  transition: all 0.3s;

  & + & {
    ${({ isPrimary }) => (!isPrimary ? 'margin-left: 10px;' : '')}
  }

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

const ItemsContainer = styled.div`
  display: flex;
`

function Link({ link, treeData, setTreeData, isPrimary, isLast, renaming, setRenaming, isFirst }) {
  const [initialAnimation, setInitialAnimation] = useState(false)

  const animationTimer = useRef(null)

  useEffect(() => {
    return () => {
      clearTimeout(animationTimer.current)
    }
  }, [])

  useEffect(() => {
    animationTimer.current = setTimeout(() => {
      setInitialAnimation(true)
    }, 50)
  }, [])

  return (
    <Container initialAnimation={initialAnimation} isFirst={isFirst} isLast={isLast} isPrimary={isPrimary}>
      <LinkContent
        initialAnimation={initialAnimation}
        link={link}
        renaming={renaming}
        setRenaming={setRenaming}
        setTreeData={setTreeData}
        treeData={treeData}
      />
      <ItemsContainer>
        {link.expanded &&
          link.items.map((branch, branchIndex) => (
            <Link
              isFirst={branchIndex === 0}
              isLast={branchIndex === link.items.length - 1}
              key={branch.id}
              link={branch}
              renaming={renaming}
              setRenaming={setRenaming}
              setTreeData={setTreeData}
              treeData={treeData}
            />
          ))}
      </ItemsContainer>
    </Container>
  )
}

export default Link
