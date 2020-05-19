import Property from './property'
import React, { useCallback, useRef } from 'react'
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

  const getActiveInput = useCallback(() => {
    if (document.activeElement === propNameInputRef.current) return 'name'
    if (document.activeElement === propValueInputRef.current) return 'value'
  }, [])

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

  const selectElementText = useCallback(element => {
    if (document.activeElement === element && isTextSelected(element)) return
    element.select()
  }, [])

  const enablePropChanging = useCallback(
    event => {
      const propId = event.currentTarget.getAttribute('data-prop-id')
      if (!propId) return
      setChangingProperty(item.properties.find(prop => prop.id === propId))
      const targetType = event.target.getAttribute('data-prop-type')
      setTimeout(() => {
        selectElementText(targetType === 'value' ? propValueInputRef.current : propNameInputRef.current)
      }, 0)
    },
    [item, setChangingProperty, selectElementText]
  )

  const switchInputSelection = useCallback(
    event => {
      const pressedEnter = event && event.keyCode === 13
      const pressedTab = event && event.keyCode === 9
      const pressedShiftTab = pressedTab && event.shiftKey
      const activeInput = getActiveInput()

      const shouldReverse =
        (activeInput === 'name' && pressedTab && !pressedShiftTab) ||
        (activeInput === 'name' && (pressedTab || pressedEnter) && changingProperty.value === '') ||
        (activeInput === 'value' && pressedShiftTab)

      if (shouldReverse) {
        event.preventDefault()
        const elementToSelect = activeInput === 'name' ? propValueInputRef.current : propNameInputRef.current
        if (changingProperty.type === 'boolean') {
          return propValueInputRef.current.focus()
        }
        return selectElementText(elementToSelect)
      }
      setChangingProperty(null)
    },
    [changingProperty, setChangingProperty, selectElementText, getActiveInput]
  )

  const updateProp = useCallback(
    event => {
      updateItemProp(changingProperty)
      switchInputSelection(event)
    },
    [changingProperty, updateItemProp, switchInputSelection]
  )

  const onPropInputKeyDown = useCallback(
    event => {
      if (event.keyCode === 13 || event.keyCode === 9) {
        updateProp(event)
      }
    },
    [updateProp]
  )

  const onPropInputFocus = useCallback(
    event => {
      clearTimeout(propBlurTimeout.current)
      if (event.currentTarget.tagName !== 'INPUT') return
      selectElementText(event.currentTarget)
    },
    [selectElementText]
  )

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
          setDraggingItem={setDraggingItem}
        />
      ))}
    </PropertiesContainer>
  )
}

export default Properties
