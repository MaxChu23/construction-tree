import ItemHead from './head'
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
  item,
  onInputChange,
  onInputKeyDown,
  renameItem,
  renaming,
  toggleChangeName,
  toggleChangeType,
  addItemProp,
  changingProperty,
  deleteItemProp,
  onPropChange,
  enablePropChanging,
  selectedPropInput,
  treeData,
  setTreeData,
  setDraggingItem,
  setChangingProperty,
}) => {
  return (
    <Container>
      <ItemHead
        item={item}
        onInputChange={onInputChange}
        onInputKeyDown={onInputKeyDown}
        renameItem={renameItem}
        renaming={renaming}
        toggleChangeName={toggleChangeName}
        toggleChangeType={toggleChangeType}
      />
      <Properties
        addItemProp={addItemProp}
        changingProperty={changingProperty}
        deleteItemProp={deleteItemProp}
        enablePropChanging={enablePropChanging}
        item={item}
        onPropChange={onPropChange}
        selectedPropInput={selectedPropInput}
        setChangingProperty={setChangingProperty}
        setDraggingItem={setDraggingItem}
        setTreeData={setTreeData}
        treeData={treeData}
      />
    </Container>
  )
}

export default Content
