import React from 'react'
import Portal from './portal'
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
  color: ${({ isRed }) => isRed ? '#fff' : '#333'};
  outline: none;
  border: 1px solid ${({ isRed }) => isRed ? "#f88" : "#777"};
  border-radius: 4px;
  ${({ animation }) => animation !== 'show' && 'pointer-events: none;'}
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);

  &:hover, &:focus {
    background: ${({ isRed }) => isRed ? "#f88" : "#fb0"};
  }

  background: ${({ isRed }) => isRed ? "#f88" : "#fff"};
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  white-space: nowrap;

  left: 50%;
  z-index: 12;
  padding: 3px 6px;
  cursor: pointer;
  user-select: none;
  ${({ index}) => `
    transition: 0.3s all, 0.1s color, transform 0.2s ${index / 20}s, opacity 0.2s ${index / 20}s;
  `}

  ${({ animation }) => `
    transform: ${animation === 'hide' ? 'translateX(-30px)' : 'translateX(0px)' };
    opacity: ${animation === 'hide' ? 0 : 1 };
  `}

  & + & {
    margin-top: 2px;
  }

  ${({ isRed }) => isRed && 'box-shadow: 0px 0px 10px rgba(255,150,150,0.5);'}
`

const ContextMenu = ({ contextMenuPositionStyle, buttonsContainerRef, showPropertiesOptions, onFocus, onBlur, addPropAndChange, buttonsAnimation, togglePropertyOptions, addLink, showDeletePrompt, deleteLink, toggleChangeType, toggleChangeName }) => (
    <Portal id="context-menu-portal" >
    <ButtonsContainerPos style={contextMenuPositionStyle} >
      <ButtonsContainer ref={buttonsContainerRef} tabIndex="1" onFocus={onFocus} onBlur={onBlur}>
        {showPropertiesOptions ?
          <>
            <Button tabIndex="2" animation={buttonsAnimation} index={1} data-prop-type="text" onClick={addPropAndChange} >{"Text"}</Button>
            <Button tabIndex="3" animation={buttonsAnimation} index={2} data-prop-type="boolean" onClick={addPropAndChange} >{"Boolean"}</Button>
            <Button tabIndex="4" animation={buttonsAnimation} index={3} data-prop-type="list" onClick={addPropAndChange} >{"List"}</Button>
            <Button tabIndex="5" animation={buttonsAnimation} index={4} onClick={togglePropertyOptions} >{"Cancel"}</Button>
          </>
            :
          <>
            <Button tabIndex="2" animation={buttonsAnimation} index={1} onClick={addLink} >{"Add Item"}</Button>
            <Button tabIndex="3" animation={buttonsAnimation} index={2} isRed={showDeletePrompt} onClick={deleteLink} >{showDeletePrompt ? "Are you sure?" : "Delete"}</Button>
            <Button tabIndex="4" animation={buttonsAnimation} index={3} onClick={toggleChangeType} >{"Change Type"}</Button>
            <Button tabIndex="5" animation={buttonsAnimation} index={4} onClick={toggleChangeName} >{"Change Name"}</Button>
            <Button tabIndex="6" animation={buttonsAnimation} index={5} onClick={togglePropertyOptions} >{"Add Property"}</Button>
          </>
        }
      </ButtonsContainer>
    </ButtonsContainerPos>
  </Portal>
)


export default ContextMenu
