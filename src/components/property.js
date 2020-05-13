import Input from './input'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { useDrag, useDrop } from 'react-dnd'

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

  opacity: ${({ isDragging }) => (!isDragging ? 1 : 0)};

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
  index,
  property,
  link,
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
  moveProp,
  setDraggingItem,
}) => {
  const confirmationTimeout = useRef(null)
  const ref = useRef(null)

  const [showConfirmation, setShowConfirmation] = useState(false)

  const [{ isDragging }, dragRef] = useDrag({
    item: {
      id: property.id,
      index,
      link: { ...link },
      propReference: property,
      type: 'prop',
    },
    begin: () => {
      setDraggingItem('prop')
    },
    end: () => {
      setDraggingItem(null)
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  const [, dropRef] = useDrop({
    accept: 'prop',
    hover: (prop, monitor) => {
      if (prop.index === index || !ref.current) return
      const external = link.id !== prop.link.id

      const hoverBoundingRect = ref.current.getBoundingClientRect()

      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      const clientOffset = monitor.getClientOffset()

      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (!external && prop.index < index && hoverClientY < hoverMiddleY) return
      // Dragging upwards
      if (!external && prop.index > index && hoverClientY > hoverMiddleY) return
      // Time to actually perform the action
      moveProp(prop, index)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      prop.link = { ...link }
      if (!external) {
        prop.link.properties.splice(prop.index, 1)
      }
      prop.index = index
      prop.link.properties.splice(index, 0, prop.propReference)
    },
  })

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

  dragRef(dropRef(ref))

  return (
    <PropertyContainer
      data-prop-id={property.id}
      isDragging={isDragging}
      key={property.id}
      onDoubleClick={enablePropChanging}
      ref={ref}
    >
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
              maxLength={24}
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
                maxLength={32}
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
