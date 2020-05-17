import Property from './property'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { findTreeLink, isTextSelected, sortProp } from '../utils'
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
  link,
  changingProperty,
  deleteLinkProp,
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
      if (prop.link.id === link.id || (link.properties && link.properties.length > 0)) return
      moveProp(prop, 0)
      prop.link = { ...link }
      prop.index = 0
      if (!prop.link.properties) {
        prop.link.properties = []
      }
      prop.link.properties.splice(0, 0, prop.propReference)
    },
  })

  const updateLinkProp = useCallback(
    prop => {
      const newTreeData = [...treeData]
      const propData = { ...prop }

      var newLink = findTreeLink({ items: newTreeData, id: link.id })
      if (!newLink) return
      var newLinkPropIndex = newLink.item.properties.findIndex(item => item.id === propData.id)
      if (newLinkPropIndex === -1) return

      if (prop.name === '' && prop.value === '') {
        newLink.item.properties.splice(newLinkPropIndex, 1)
      } else {
        propData.value =
          propData.type === 'boolean' ? propData.value === 'true' || propData.value === true : propData.value
        newLink.item.properties[newLinkPropIndex] = { ...newLink.item.properties[newLinkPropIndex], ...propData }
      }

      setTreeData(newTreeData)
      return newLink.item.properties[newLinkPropIndex]
    },
    [link, treeData, setTreeData]
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
      setChangingProperty(link.properties.find(prop => prop.id === propId))
      const type = event.target.getAttribute('data-prop-type')
      if (type) {
        setSelectedPropInput(type)
      }
    },
    [link, setChangingProperty]
  )

  const updateProp = useCallback(() => {
    updateLinkProp(changingProperty)
    setChangingProperty(null)
  }, [changingProperty, updateLinkProp, setChangingProperty])

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
      setTreeData(sortProp(treeData, link, prop, hoverIndex))
    },
    [link, treeData, setTreeData]
  )

  if (!link.properties || link.properties.length === 0) return <DropContainer ref={dropRef} />

  return (
    <PropertiesContainer>
      {link.properties.map((property, index) => (
        <Property
          changingProperty={changingProperty}
          deleteLinkProp={deleteLinkProp}
          enablePropChanging={enablePropChanging}
          index={index}
          key={property.id}
          link={link}
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
