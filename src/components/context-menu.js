import Portal from './portal'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const ButtonsContainerPos = styled.div`
  position: absolute;
`

const ButtonsContainer = styled.div`
  display: flex;
  position: absolute;
  justify-content: center;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 10px;
  z-index: 10;
  outline: none;
`

const Button = styled.button`
  -webkit-appearance: none;
  color: ${({ isRed }) => (isRed ? '#fff' : '#333')};
  outline: none;
  border: 1px solid ${({ isRed }) => (isRed ? '#f88' : '#777')};
  border-radius: 4px;
  ${({ animation }) => animation !== 'show' && 'pointer-events: none;'}
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);

  &:hover,
  &:focus {
    background: ${({ isRed }) => (isRed ? '#f88' : '#fb0')};
  }

  background: ${({ isRed }) => (isRed ? '#f88' : '#fff')};
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  white-space: nowrap;

  left: 50%;
  z-index: 12;
  padding: 3px 6px;
  cursor: pointer;
  user-select: none;
  ${({ index }) => `
    transition: 0.3s all, 0.1s color, transform 0.2s ${index / 20}s, opacity 0.2s ${index / 20}s;
  `}

  ${({ animation }) => `
    transform: ${animation === 'hide' ? 'translateX(-30px)' : 'translateX(0px)'};
    opacity: ${animation === 'hide' ? 0 : 1};
  `}

  & + & {
    margin-top: 2px;
  }

  ${({ isRed }) => isRed && 'box-shadow: 0px 0px 10px rgba(255,150,150,0.5);'}
`

const ContextMenu = ({
  contextMenuPositionStyle,
  buttonsContainerRef,
  showPropertiesOptions,
  onFocus,
  onBlur,
  addPropAndChange,
  buttonsAnimation,
  togglePropertyOptions,
  addLink,
  deleteLink,
  toggleChangeType,
  toggleChangeName,
}) => {
  const [showDeletePrompt, setShowDeletePrompt] = useState(false)
  const deletePromptTimeout = useRef(null)

  const onDeleteButtonClick = useCallback(() => {
    if (!showDeletePrompt) {
      setShowDeletePrompt(true)
      deletePromptTimeout.current = setTimeout(() => {
        setShowDeletePrompt(false)
      }, 1000)
      return
    }

    deleteLink()
  }, [deleteLink, showDeletePrompt])

  useEffect(() => () => clearTimeout(deletePromptTimeout.current), [])

  return (
    <Portal id="context-menu-portal">
      <ButtonsContainerPos style={contextMenuPositionStyle}>
        <ButtonsContainer onBlur={onBlur} onFocus={onFocus} ref={buttonsContainerRef} tabIndex="0">
          {showPropertiesOptions ? (
            <>
              <Button
                animation={buttonsAnimation}
                data-prop-type="text"
                index={1}
                onClick={addPropAndChange}
                tabIndex="0"
              >
                {'Text'}
              </Button>
              <Button
                animation={buttonsAnimation}
                data-prop-type="boolean"
                index={2}
                onClick={addPropAndChange}
                tabIndex="0"
              >
                {'Boolean'}
              </Button>
              <Button animation={buttonsAnimation} index={4} onClick={togglePropertyOptions} tabIndex="0">
                {'Cancel'}
              </Button>
            </>
          ) : (
            <>
              <Button animation={buttonsAnimation} index={1} onClick={addLink} tabIndex="0">
                {'Add Item'}
              </Button>
              <Button
                animation={buttonsAnimation}
                index={2}
                isRed={showDeletePrompt}
                onClick={onDeleteButtonClick}
                tabIndex="0"
              >
                {showDeletePrompt ? 'Are you sure?' : 'Delete'}
              </Button>
              <Button animation={buttonsAnimation} index={3} onClick={toggleChangeType} tabIndex="0">
                {'Change Type'}
              </Button>
              <Button animation={buttonsAnimation} index={4} onClick={toggleChangeName} tabIndex="0">
                {'Change Name'}
              </Button>
              <Button animation={buttonsAnimation} index={5} onClick={togglePropertyOptions} tabIndex="0">
                {'Add Property'}
              </Button>
            </>
          )}
        </ButtonsContainer>
      </ButtonsContainerPos>
    </Portal>
  )
}

export default ContextMenu
