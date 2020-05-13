import Property from './property'
import React from 'react'
import styled from 'styled-components'
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
  enablePropChanging,
  onPropInputFocus,
  onPropInputBlur,
  propNameInputRef,
  propValueInputRef,
  onPropChange,
  onPropInputKeyDown,
  selectedPropInput,
  deleteLinkProp,
  moveProp,
  setDraggingItem,
}) => {
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

  if (!link.properties || link.properties.length === 0) return <DropContainer ref={dropRef} />

  return (
    <PropertiesContainer ref={dropRef}>
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
