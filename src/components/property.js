import Input from './input'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

const DeleteButton = styled.button`
  -webkit-appearance: none;
  border: none;
  background: none;
  position: absolute;
  top: 0px;
  left: -6px;
  padding: 0;
  width: 14px;
  height: 14px;
  cursor: pointer;
  outline: none;
  font-weight: 700;
  font-size: 12px;
  line-height: 0;

  ${({ showConfirmation }) => showConfirmation && 'color: #f50; border: 1px solid #f50; border-radius: 50%;'}

  &:hover {
    span {
      &::before,
      &::after {
        background: #f50;
      }
    }
  }

  span {
    position: absolute;
    top: 1px;
    transform: rotate(45deg) translate(-50%, -50%);

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      width: 8px;
      height: 8px;
      background: #333;
      transform: scale(0.5);
      transition: all 0.2s;
    }

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      width: 8px;
      height: 8px;
      background: #333;
      transform: scale(0.5);
      transition: all 0.2s;
    }
  }
`

const PropertyContainer = styled.div`
  display: flex;
  align-items: flex-start;
  font-size: 12px;
  padding-left: 10px;
  position: relative;
  width: 100%;
  min-height: 18px;

  &:hover {
    ${DeleteButton} span {
      &::before {
        transform: scaleY(0.2);
      }
      &::after {
        transform: scaleX(0.2);
      }
    }
  }
`

const PropertyName = styled.div`
  font-weight: 700;
  padding-right: 5px;
  color: #333;
  flex: 1;
  flex-grow: 0;
  flex-basis: 40%;
  position: relative;
  width: 40%;
  overflow-x: hidden;
`

const PropertyValue = styled.div`
  color: #333;
  flex: 1;
  position: relative;
  width: 60%;
  overflow-x: hidden;

  ${({ property }) =>
    property.type === 'boolean'
      ? `
      font-weight: 700;
      color: ${property.value ? '#0066cf' : '#c71c00'};
    `
      : ''};
`

const PropInput = styled(Input)`
  position: absolute;
  top: 0;
  left: 0px;
  font-size: 12px;
  text-align: left;
  padding: 0;
  width: 100%;

  &[data-prop-type='value'] {
    font-weight: normal;
  }
`

const PropSelect = styled.select``

const InputFiller = styled.span`
  display: block;
  color: transparent;
  padding: 0;
  user-select: none;
  font-size: 12px;
  white-space: pre;
  flex: 1;
`

const Property = ({
  property,
  enablePropChanging,
  changingProperty,
  onPropInputFocus,
  onPropInputBlur,
  propNameInputRef,
  onPropInputKeyDown,
  onPropChange,
  propValueInputRef,
  selectedPropInput,
  deleteLinkProp,
}) => {
  const confirmationTimeout = useRef(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const onDeleteButtonClick = useCallback(() => {
    clearTimeout(confirmationTimeout.current)
    if (!showConfirmation) {
      setShowConfirmation(true)
      confirmationTimeout.current = setTimeout(() => {
        setShowConfirmation(false)
      }, 1000)
      return
    }
    deleteLinkProp(property.id)
  }, [deleteLinkProp, showConfirmation, property.id])

  useEffect(() => () => clearTimeout(confirmationTimeout.current), [])

  const value = useMemo(() => (property.type === 'boolean' ? (property.value ? 'Yes' : 'No') : property.value), [
    property,
  ])

  return (
    <PropertyContainer data-prop-id={property.id} key={property.id} onDoubleClick={enablePropChanging}>
      <DeleteButton onClick={onDeleteButtonClick} showConfirmation={showConfirmation}>
        {showConfirmation ? '?' : <span />}
      </DeleteButton>
      <PropertyName data-prop-type="name">
        {changingProperty && changingProperty.id === property.id ? (
          <>
            <InputFiller>{changingProperty.name || 'Key'}</InputFiller>
            <PropInput
              autoFocus={selectedPropInput === 'name' || changingProperty.name === ''}
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
      <PropertyValue data-prop-type="value" property={property}>
        {changingProperty && changingProperty.id === property.id ? (
          changingProperty.type === 'text' ? (
            <>
              <InputFiller>{changingProperty.value || 'Value'}</InputFiller>
              <PropInput
                autoFocus={selectedPropInput === 'value'}
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
            </>
          ) : (
            <PropSelect
              autoFocus={selectedPropInput === 'value'}
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
          )
        ) : (
          value
        )}
      </PropertyValue>
    </PropertyContainer>
  )
}

export default Property
