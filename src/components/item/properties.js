import Property from './property'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { findTreeItem, isTextSelected, sortProp } from '../../utils'
import { useDrop } from 'react-dnd'

const PropertiesContainer = styled.div`
  display: block;
  padding: 3px 10px;
  margin-top: 1px;
  border-top: 1px solid #999;
  width: 100%;
  border-top-style: dashed;
`

const DropContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 5px;
  z-index: 100;
`

const Properties = ({
  item,
  changingProperty,
  deleteItemProp,
  setDraggingItem,
  setTreeData,
  treeData,
  setChangingProperty,
}) => {
  const propBlurTimeout = useRef(null)
  const [selectedPropInput, setSelectedPropInput] = useState(null)
  const propNameInputRef = useRef(null)
  const propValueInputRef = useRef(null)

  const [, dropRef] = useDrop({
    accept: 'prop',
    hover: prop => {
      if (prop.item.id === item.id || (item.properties && item.properties.length > 0)) return
      moveProp(prop, 0)
      prop.item = { ...item }
      prop.index = 0
      if (!prop.item.properties) {
        prop.item.properties = []
      }
      prop.item.properties.splice(0, 0, prop.propReference)
    },
  })

  const updateItemProp = useCallback(
    prop => {
      const newTreeData = [...treeData]
      const propData = { ...prop }

      var newItem = findTreeItem({ items: newTreeData, id: item.id })
      if (!newItem) return
      var newItemPropIndex = newItem.item.properties.findIndex(child => child.id === propData.id)
      if (newItemPropIndex === -1) return

      if (prop.name === '' && prop.value === '') {
        newItem.item.properties.splice(newItemPropIndex, 1)
      } else {
        propData.value =
          propData.type === 'boolean' ? propData.value === 'true' || propData.value === true : propData.value
        newItem.item.properties[newItemPropIndex] = { ...newItem.item.properties[newItemPropIndex], ...propData }
      }

      setTreeData(newTreeData)
      return newItem.item.properties[newItemPropIndex]
    },
    [item, treeData, setTreeData]
  )

  const onPropChange = useCallback(
    event => {
      const type = event.target.getAttribute('data-prop-type')
      setChangingProperty({ ...changingProperty, [type]: event.target.value })
    },
    [changingProperty, setChangingProperty]
  )

  useEffect(() => {
    if (!selectedPropInput || !changingProperty || changingProperty.type !== 'text') return
    if (selectedPropInput === 'name') {
      propNameInputRef.current.select()
    } else {
      propValueInputRef.current.select()
    }
    setSelectedPropInput(null)
  }, [changingProperty, selectedPropInput])

  const enablePropChanging = useCallback(
    event => {
      const propId = event.currentTarget.getAttribute('data-prop-id')
      if (!propId) return
      setChangingProperty(item.properties.find(prop => prop.id === propId))
      const type = event.target.getAttribute('data-prop-type')
      if (type) {
        setSelectedPropInput(type)
      }
    },
    [item, setChangingProperty]
  )

  const updateProp = useCallback(() => {
    updateItemProp(changingProperty)
    setChangingProperty(null)
  }, [changingProperty, updateItemProp, setChangingProperty])

  const onPropInputKeyDown = useCallback(
    event => {
      if (event.key === 'Enter') {
        updateProp()
      }
    },
    [updateProp]
  )

  const onPropInputFocus = useCallback(event => {
    clearTimeout(propBlurTimeout.current)
    if (event.currentTarget.tagName !== 'INPUT') return
    if (!isTextSelected(event.currentTarget)) {
      event.currentTarget.select()
    }
  }, [])

  const onPropInputBlur = useCallback(() => {
    propBlurTimeout.current = setTimeout(() => {
      updateProp()
    }, 50)
  }, [updateProp])

  const moveProp = useCallback(
    (prop, hoverIndex) => {
      setTreeData(sortProp(treeData, item, prop, hoverIndex))
    },
    [item, treeData, setTreeData]
  )

  if (!item.properties || item.properties.length === 0) return <DropContainer ref={dropRef} />

  return (
    <PropertiesContainer>
      {item.properties.map((property, index) => (
        <Property
          changingProperty={changingProperty}
          deleteItemProp={deleteItemProp}
          enablePropChanging={enablePropChanging}
          index={index}
          item={item}
          key={property.id}
          moveProp={moveProp}
          onPropChange={onPropChange}
          onPropInputBlur={onPropInputBlur}
          onPropInputFocus={onPropInputFocus}
          onPropInputKeyDown={onPropInputKeyDown}
          property={property}
          propNameInputRef={propNameInputRef}
          propValueInputRef={propValueInputRef}
          selectedPropInput={selectedPropInput}
          setDraggingItem={setDraggingItem}
        />
      ))}
    </PropertiesContainer>
  )
}

export default Properties
