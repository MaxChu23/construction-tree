import Property from './property'
import React from 'react'
import styled from 'styled-components'

const PropertiesContainer = styled.div`
  display: block;
  padding: 3px 10px;
  margin-top: 1px;
  border-top: 1px solid #999;
  width: 100%;
  border-top-style: dashed;
`

let Properties = ({
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
}) => {
  return (
    <PropertiesContainer>
      {link.properties.map((property, index) => (
        <Property
          changingProperty={changingProperty}
          deleteLinkProp={deleteLinkProp}
          enablePropChanging={enablePropChanging}
          index={index}
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
        />
      ))}
    </PropertiesContainer>
  )
}

export default Properties
