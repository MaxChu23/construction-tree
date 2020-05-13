import LinkHead from './link-head'
import Properties from './properties'
import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid #777;
  border-radius: 6px;
  min-width: 100px;
  max-width: 300px;
  overflow: hidden;
  background: #fff;

  box-shadow: 0px 3px 6px rgba(0, 50, 100, 0.2);
`

const Content = ({
  link,
  onInputChange,
  onInputKeyDown,
  renameLink,
  renaming,
  toggleChangeName,
  toggleChangeType,
  addLinkProp,
  changingProperty,
  deleteLinkProp,
  moveProp,
  onPropChange,
  onPropInputBlur,
  onPropInputFocus,
  enablePropChanging,
  onPropInputKeyDown,
  propNameInputRef,
  propValueInputRef,
  selectedPropInput,
  setDraggingItem,
}) => {
  return (
    <Container>
      <LinkHead
        link={link}
        onInputChange={onInputChange}
        onInputKeyDown={onInputKeyDown}
        renameLink={renameLink}
        renaming={renaming}
        toggleChangeName={toggleChangeName}
        toggleChangeType={toggleChangeType}
      />

      <Properties
        addLinkProp={addLinkProp}
        changingProperty={changingProperty}
        deleteLinkProp={deleteLinkProp}
        enablePropChanging={enablePropChanging}
        link={link}
        moveProp={moveProp}
        onPropChange={onPropChange}
        onPropInputBlur={onPropInputBlur}
        onPropInputFocus={onPropInputFocus}
        onPropInputKeyDown={onPropInputKeyDown}
        propNameInputRef={propNameInputRef}
        propValueInputRef={propValueInputRef}
        selectedPropInput={selectedPropInput}
        setDraggingItem={setDraggingItem}
      />
    </Container>
  )
}

export default Content
