import Input from './input'
import React, { useMemo } from 'react'
import styled from 'styled-components'

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

const PropsListContainer = styled.div``

const PropsListValue = styled.div``

function PropsList({ list }) {
  return (
    <PropsListContainer>
      {list.map(item => (
        <PropsListValue key={item.id}>{`- ${item.key}: ${item.value}`}</PropsListValue>
      ))}
    </PropsListContainer>
  )
}

function Property({
  property,
  enablePropChanging,
  changingProperty,
  onPropInputFocus,
  onPropInputBlur,
  propNameInputRef,
  onPropInputKeyDown,
  onPropChange,
  propValueInputRef,
}) {
  const value = useMemo(() => (property.type === 'boolean' ? (property.value ? 'Yes' : 'No') : property.value), [
    property,
  ])

  return (
    <PropertyContainer data-prop-id={property.id} draggable key={property.id} onDoubleClick={enablePropChanging}>
      <PropertyName data-prop-type="name">
        {changingProperty && changingProperty.id === property.id ? (
          <>
            <InputFiller>{changingProperty.name || 'Key'}</InputFiller>
            <PropInput
              autoFocus
              color="#333"
              data-prop-type="name"
              onBlur={onPropInputBlur}
              onChange={onPropChange}
              onFocus={onPropInputFocus}
              onKeyDown={onPropInputKeyDown}
              placeholder="Key"
              ref={propNameInputRef}
              tabIndex="0"
              value={changingProperty.name}
            />
          </>
        ) : (
          `${property.name}:`
        )}
      </PropertyName>
      <PropertyValue data-prop-type="value">
        {changingProperty && changingProperty.id === property.id ? (
          <>
            <InputFiller>{changingProperty.value || 'Value'}</InputFiller>
            {changingProperty.type === 'text' ? (
              <PropInput
                color="#333"
                data-prop-type="value"
                onBlur={onPropInputBlur}
                onChange={onPropChange}
                onFocus={onPropInputFocus}
                onKeyDown={onPropInputKeyDown}
                placeholder="Value"
                ref={propValueInputRef}
                tabIndex="0"
                value={changingProperty.value}
              />
            ) : (
              <PropSelect
                data-prop-type="value"
                onBlur={onPropInputBlur}
                onChange={onPropChange}
                onFocus={onPropInputFocus}
                ref={propValueInputRef}
                tabIndex="0"
                value={changingProperty.value}
              >
                <option value="true">{'Yes'}</option>
                <option value="false">{'No'}</option>
              </PropSelect>
            )}
          </>
        ) : property.type === 'list' ? (
          <PropsList list={property.value} />
        ) : (
          value
        )}
      </PropertyValue>
    </PropertyContainer>
  )
}

function Properties({
  link,
  changingProperty,
  enablePropChanging,
  onPropInputFocus,
  onPropInputBlur,
  propNameInputRef,
  propValueInputRef,
  onPropChange,
  onPropInputKeyDown,
}) {
  return (
    <PropertiesContainer>
      {link.properties.map(property => (
        <Property
          changingProperty={changingProperty}
          enablePropChanging={enablePropChanging}
          key={property.id}
          onPropChange={onPropChange}
          onPropInputBlur={onPropInputBlur}
          onPropInputFocus={onPropInputFocus}
          onPropInputKeyDown={onPropInputKeyDown}
          property={property}
          propNameInputRef={propNameInputRef}
          propValueInputRef={propValueInputRef}
        />
      ))}
    </PropertiesContainer>
  )
}

export default Properties
