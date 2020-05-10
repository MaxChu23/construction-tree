import Input from './input'
import React, { useMemo } from 'react'
import styled from 'styled-components'

const TypeContainer = styled.div`
  background: linear-gradient(-45deg, #88ffe4, #5874ff);
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #333;
`

const Type = styled.div`
  padding: 2px 10px;
  color: #fff;
  font-weight: 700;
  text-transform: uppercase;
  user-select: none;
  font-size: 12px;
`

const Name = styled.div`
  color: #333;
  font-weight: 700;
  user-select: none;
  text-align: center;
  font-size: 14px;

  width: 100%;
  padding: 2px 10px;
`

const LinkHead = ({
  toggleChangeName,
  toggleChangeType,
  renameLink,
  onInputChange,
  onInputKeyDown,
  renaming,
  link,
}) => {
  const renamingType = useMemo(() => renaming && renaming.id === link.id && renaming.type, [link.id, renaming])

  return (
    <>
      <TypeContainer onDoubleClick={toggleChangeType}>
        {renamingType === 'type' ? (
          <Input
            autoFocus
            color="#fff"
            data-rename="type"
            onBlur={renameLink}
            onChange={onInputChange}
            onKeyDown={onInputKeyDown}
            tabIndex="0"
            value={renaming.value}
          />
        ) : (
          <Type>{link.type}</Type>
        )}
      </TypeContainer>
      {renamingType === 'name' ? (
        <Input
          autoFocus
          color="#333"
          data-rename="name"
          onBlur={renameLink}
          onChange={onInputChange}
          onKeyDown={onInputKeyDown}
          tabIndex="0"
          type="name"
          value={renaming.value}
        />
      ) : (
        <Name onDoubleClick={toggleChangeName}>{link.name}</Name>
      )}
    </>
  )
}

export default LinkHead
