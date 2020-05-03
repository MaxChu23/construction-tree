import React, { useMemo } from 'react'
import styled from 'styled-components'
import Input from './input'

const PropertiesContainer = styled.div`
  display: block;
  padding: 3px 10px;
  margin-top: 1px;
  border-top: 1px solid #999;
  width: 100%;
  border-top-style: dashed;
`

const PropertyContainer = styled.div`
  display: flex;
  font-size: 12px;
  padding-left: 10px;
  position: relative;
  width: 100%;

  &::before {
    content: '';
    position: absolute;
    width: 4px;
    height: 4px;
    left: 0;
    background: #333;
    top: 5px;
    transform: rotate(45deg);
  }
`

const PropertyName = styled.div`
  font-weight: 700;
  padding-right: 5px;
  color: #333;
  flex: 0;
  position: relative;
  white-space: nowrap;
`

const PropertyValue = styled.div`
  color: #333;
  flex: 1;
  position: relative;
  margin-left: 10px;
`

const PropInput = styled(Input)`
  position: absolute;
  top: 0;
  left: 0px;
  font-size: 12px;
  text-align: left;
  padding: 0;
  width: 100%;
  & + & {
    margin-left: 10px;
  }

  &[data-prop-type='value'] {
    font-weight: normal;
  }
`

const PropSelect = styled.select`
  position: absolute;
  top: 0;
  left: 10px;
`

const InputFiller = styled.span`
  display: block;
  color: transparent;
  padding: 0;
  user-select: 0;
  font-size: 12px;
  white-space: pre;
  max-width: 125px;
`

const PropsListContainer = styled.div`

`

const PropsListValue = styled.div`

`

const PropsList = ({list}) => {

  return (  <PropsListContainer>
    {list.map(item => (
      <PropsListValue key={item.id} >{`- ${item.key}: ${item.value}`}</PropsListValue>
    ))}
  </PropsListContainer>
)}

const Property = ({ property, enablePropChanging, changingProperty, onPropInputFocus, onPropInputBlur, propNameInputRef, onPropInputKeyDown, onPropChange, propValueInputRef }) => {
  const value = useMemo(() => property.type === 'boolean' ? (property.value ? 'Yes' : 'No') : property.value, [property])

  return (
    <PropertyContainer draggable key={property.id} data-prop-id={property.id} onDoubleClick={enablePropChanging} >
      <PropertyName data-prop-type="name" >
      {changingProperty && changingProperty.id === property.id ?
        <>
          <InputFiller>{changingProperty.name || 'Key'}</InputFiller>
          <PropInput autoFocus onFocus={onPropInputFocus} onBlur={onPropInputBlur} tabIndex="1" ref={propNameInputRef} placeholder="Key" data-prop-type="name" onKeyDown={onPropInputKeyDown} onChange={onPropChange} value={changingProperty.name} color={"#333"} />
        </>
        :
        `${property.name}:`
      }
      </PropertyName>
      <PropertyValue data-prop-type="value">
        {changingProperty && changingProperty.id === property.id ?
          <>
            <InputFiller>{changingProperty.value || 'Value'}</InputFiller>
            {
              changingProperty.type === 'text' ?
              <PropInput onFocus={onPropInputFocus} onBlur={onPropInputBlur} ref={propValueInputRef} tabIndex="2" placeholder="Value" data-prop-type="value" onKeyDown={onPropInputKeyDown} onChange={onPropChange} value={changingProperty.value} color={"#333"} />
              :
              <PropSelect onFocus={onPropInputFocus} onBlur={onPropInputBlur} ref={propValueInputRef} onChange={onPropChange} data-prop-type="value" value={changingProperty.value} tabIndex="2" >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </PropSelect>
            }
          </>
           :
           (property.type === 'list' ?
           <PropsList list={property.value} />
           :
             value)}
      </PropertyValue>
    </PropertyContainer>
  )
}

const Properties = ({ link, changingProperty, enablePropChanging, onPropInputFocus, onPropInputBlur, propNameInputRef, propValueInputRef, onPropChange, onPropInputKeyDown }) => {
  return (
    <PropertiesContainer>
    {link.properties.map(property => (
        <Property key={property.id} property={property} enablePropChanging={enablePropChanging} changingProperty={changingProperty} onPropInputFocus={onPropInputFocus} onPropInputBlur={onPropInputBlur} propNameInputRef={propNameInputRef} onPropInputKeyDown={onPropInputKeyDown} onPropChange={onPropChange} propValueInputRef={propValueInputRef}></Property>
      ))
    }
    </PropertiesContainer>
  )
}

export default Properties
