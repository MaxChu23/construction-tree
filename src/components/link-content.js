import ContextMenu from './context-menu'
import Input from './input'
import Properties from './properties'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { findTreeLink, isTextSelected } from '../utils'

const HasItemsIndicator = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
  cursor: pointer;
  height: 20px;

  span {
    display: block;
    width: 14px;
    height: 14px;
    margin: 0 auto;
    color: ${({ expanded }) => (expanded ? '#777' : '#0bf')};
    user-select: none;
    background: #fff;
    border-radius: 50%;
    text-align: center;
    border: 1px solid ${({ expanded }) => (expanded ? '#777' : 'rgba(100,200,255,0.5)')};

    transition: 0.3s all;

    ${({ expanded }) => !expanded && 'box-shadow: 0px 0px 5px 1px rgba(100, 200, 255, 0.5);'}

    ${({ expanded }) =>
      expanded
        ? `
      animation: 0.6s hasNoItems;
      animation-fill-mode: forwards;
    `
        : `
      animation: 1.2s hasItemsAnimation infinite;
    `}

    &::before {
      content: '';
      position: absolute;
      top: 2px;
      bottom: 2px;
      width: 1px;
      left: 50%;
      background: #777;
      transition: transform 0.3s;
      transform: translateX(-50%) scale(${({ expanded }) => (expanded ? 0 : 1)});
    }

    &::after {
      content: '';
      position: absolute;
      left: 2px;
      right: 2px;
      top: 50%;
      height: 1px;
      background: #777;
      transform: translateY(-50%);
    }
  }
`

const ContentContainer = styled.div`
  position: relative;

  ${({ expanded }) => `
    &::before {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      width: 1px;
      height: 30px;
      background: #777;
      transition: transform 0.2s ease-in;
      transform: scaleY(${expanded ? 1 : 0});
      transform-origin: top;
    }
  `}

  ${({ showContextMenu }) =>
    !showContextMenu
      ? `
    &:hover {
      ${ButtonsLauncher} {
        transform: scale(1);
        opacity: 1;
      }
    }
  `
      : `${ButtonsLauncher} { transform: scale(1); opacity: 1; }`}
`

const ButtonsLauncher = styled.div`
  transform: scale(0);
  opacity: 0;
  outline: none;
  position: absolute;
  top: -4px;
  right: -4px;
  width: 12px;
  height: 12px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #777;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 12;

  &:hover {
    background: #fb0;
    &::before {
      transform: rotate(0deg) scale(1);
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: 2px;
    bottom: 2px;
    left: 2px;
    right: 2px;
    background: #333;
    transform: rotate(45deg) scale(0.6);
    transition: transform 0.3s;
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid #777;
  border-radius: 6px;
  min-width: 100px;
  max-width: 300px;
  overflow: hidden;
  background: #fff;

  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.3);
`

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

const LinkContent = ({ treeData, link, renaming, setRenaming, setTreeData, initialAnimation }) => {
  const propBlurTimeout = useRef(null)

  const buttonsLauncherRef = useRef(null)
  const buttonsContainerRef = useRef(null)
  const propNameInputRef = useRef(null)
  const propValueInputRef = useRef(null)

  const deletePromptTimeout = useRef(null)
  const contextMenuTimeout = useRef(null)
  const contextMenuTimeout2 = useRef(null)
  const blurTimeoutRef = useRef(null)

  const [selectedPropInput, setSelectedPropInput] = useState(null)

  const [showContextMenu, setShowContextMenu] = useState(false)
  const renamingType = useMemo(() => renaming && renaming.id === link.id && renaming.type, [link.id, renaming])

  const [showDeletePrompt, setShowDeletePrompt] = useState(false)
  const [buttonsAnimation, setButtonsAnimation] = useState('hide')
  const [showPropertiesOptions, setShowPropertiesOptions] = useState(false)
  const [changingProperty, setChangingProperty] = useState(null)

  const toggleShowContextMenu = useCallback(
    ({ blur } = {}) => {
      clearTimeout(contextMenuTimeout.current)
      clearTimeout(contextMenuTimeout2.current)

      contextMenuTimeout.current = setTimeout(
        () => {
          if (blur) {
            setShowContextMenu(false)
            setShowPropertiesOptions(false)
            return
          }
          setShowContextMenu(buttonsAnimation === 'hide')
        },
        blur || buttonsAnimation !== 'hide' ? 1000 : 10
      )

      contextMenuTimeout2.current = setTimeout(() => {
        setButtonsAnimation(buttonsAnimation === 'hide' ? 'show' : 'hide')
      }, 50)
    },
    [buttonsAnimation, setShowContextMenu]
  )

  const addLink = useCallback(() => {
    const newTreeData = [...treeData]

    var newLink = findTreeLink({ items: newTreeData, id: link.id })
    if (!newLink) return

    const obj = {
      id: newLink.item.id + '.' + newLink.item.items.length,
      type: '',
      name: '',
      expanded: false,
      items: [],
    }

    newLink.item.items.push(obj)
    newLink.item.expanded = true

    setTreeData(newTreeData)
    setRenaming({ id: obj.id, type: 'type', value: '' })
    toggleShowContextMenu()
  }, [link.id, setTreeData, treeData, toggleShowContextMenu, setRenaming])

  const deleteLink = useCallback(() => {
    if (!showDeletePrompt) {
      setShowDeletePrompt(true)
      deletePromptTimeout.current = setTimeout(() => {
        setShowDeletePrompt(false)
      }, 1000)
      return
    }

    const newTreeData = [...treeData]

    var newLink = findTreeLink({ items: newTreeData, id: link.id })
    if (!newLink) return

    const index = newLink.items.indexOf(newLink.item)
    if (index === -1) return

    newLink.items.splice(index, 1)

    setTreeData(newTreeData)
    toggleShowContextMenu()
  }, [link.id, setTreeData, treeData, toggleShowContextMenu, showDeletePrompt])

  const deleteLinkProp = useCallback(
    propId => {
      const newTreeData = [...treeData]

      var newLink = findTreeLink({ items: newTreeData, id: link.id })
      if (!newLink) return
      var newLinkPropIndex = newLink.item.properties.findIndex(item => item.id === propId)
      if (newLinkPropIndex === -1) return

      newLink.item.properties.splice(newLinkPropIndex, 1)

      setTreeData(newTreeData)
      return newLink.item.properties[newLinkPropIndex]
    },
    [setTreeData, treeData, link]
  )

  const handleExpand = useCallback(() => {
    const newTreeData = [...treeData]

    const newLink = findTreeLink({ items: newTreeData, id: link.id })
    if (!newLink) return

    newLink.item.expanded = !link.expanded

    setTreeData(newTreeData)
  }, [link.expanded, link.id, treeData, setTreeData])

  const renameLink = useCallback(
    event => {
      const value = event.target.value

      const newTreeData = [...treeData]

      var newLink = findTreeLink({ items: newTreeData, id: link.id })
      if (!newLink || !renaming) return

      newLink.item[renaming.type] = value

      setRenaming(link.name === '' ? { id: link.id, type: 'name', value: '' } : null)
      setTreeData(newTreeData)
    },
    [renaming, link, treeData, setTreeData, setRenaming]
  )

  const addLinkProp = useCallback(
    (prop, index) => {
      const newTreeData = [...treeData]

      var newLink = findTreeLink({ items: newTreeData, id: link.id })
      if (!newLink) return

      const newLinkProp = { ...prop }
      const props = newLink.item.properties || []

      if (!newLinkProp.id) {
        newLinkProp.id = props.length + 1
      }

      // TODO: desctruct the object first!
      if (index) {
        newLink.item.properties.splice(index, 0, newLinkProp)
      } else {
        newLink.item.properties = [...props, newLinkProp]
      }

      setTreeData(newTreeData)
      return newLinkProp
    },
    [link, treeData, setTreeData]
  )

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

  const toggleChangeName = useCallback(() => {
    setRenaming({ id: link.id, type: 'name', value: link.name })
  }, [setRenaming, link.id, link.name])

  const toggleChangeType = useCallback(() => {
    setRenaming({ id: link.id, type: 'type', value: link.type })
  }, [setRenaming, link.id, link.type])

  const onInputKeyDown = useCallback(
    event => {
      if (event.key === 'Enter') {
        renameLink(event)
      }
    },
    [renameLink]
  )

  const onBlur = useCallback(() => {
    blurTimeoutRef.current = setTimeout(() => {
      toggleShowContextMenu({ blur: true })
    }, 100)
  }, [toggleShowContextMenu])

  const onFocus = useCallback(() => {
    clearTimeout(blurTimeoutRef.current)
  }, [])

  const onInputChange = useCallback(
    event => {
      setRenaming({ ...renaming, value: event.target.value })
    },
    [renaming, setRenaming]
  )

  const togglePropertyOptions = useCallback(() => {
    // Add prop
    setShowPropertiesOptions(!showPropertiesOptions)
  }, [showPropertiesOptions])

  useEffect(() => {
    if (buttonsAnimation === 'show' || (showPropertiesOptions && buttonsAnimation === 'show')) {
      setTimeout(() => {
        buttonsContainerRef.current && buttonsContainerRef.current.focus()
      }, 10)
    }
  }, [buttonsAnimation, showPropertiesOptions])

  const contextMenuPositionStyle = useMemo(() => {
    if (!showContextMenu) return
    if (!buttonsLauncherRef || !buttonsLauncherRef.current) return {}
    const result = {}
    const clientRect = buttonsLauncherRef.current.getBoundingClientRect()
    const contextMenuExceedsWidth = clientRect.x + 100 - window.innerWidth > 0
    const contextMenuExceedsHeight = clientRect.y + 100 - window.innerHeight > 0

    if (contextMenuExceedsWidth) {
      result.right = 100
    } else {
      result.left = clientRect.x
    }

    if (contextMenuExceedsHeight) {
      result.bottom = 100
    } else {
      result.top = clientRect.y
    }

    return result
  }, [showContextMenu])

  const addPropAndChange = useCallback(
    event => {
      onBlur()

      const type = event.target.getAttribute('data-prop-type')
      const defaultValues = {
        text: '',
        boolean: false,
      }
      const value = defaultValues[type]
      const prop = {
        type,
        name: '',
        value,
      }
      const newProp = addLinkProp(prop)
      setChangingProperty(newProp)
    },
    [onBlur, addLinkProp]
  )

  const onOkButtonClick = useCallback(() => {
    updateLinkProp(changingProperty)
    setChangingProperty(null)
  }, [changingProperty, updateLinkProp])

  const onPropInputKeyDown = useCallback(
    event => {
      if (event.key === 'Enter') {
        onOkButtonClick()
      }
    },
    [onOkButtonClick]
  )

  const onPropChange = useCallback(
    event => {
      const type = event.target.getAttribute('data-prop-type')
      setChangingProperty({ ...changingProperty, [type]: event.target.value })
    },
    [changingProperty]
  )

  const enablePropChanging = useCallback(
    event => {
      const propId = event.currentTarget.getAttribute('data-prop-id')
      if (!propId) return
      setChangingProperty(link.properties.find(prop => prop.id === +propId))
      const type = event.target.getAttribute('data-prop-type')
      if (type) {
        setSelectedPropInput(type)
      }
    },
    [link]
  )

  const onPropInputBlur = useCallback(() => {
    propBlurTimeout.current = setTimeout(() => {
      onOkButtonClick()
    }, 50)
  }, [onOkButtonClick])

  const onPropInputFocus = useCallback(event => {
    if (event.currentTarget.tagName === 'INPUT' && !isTextSelected(event.currentTarget)) {
      event.currentTarget.select()
    }
    clearTimeout(propBlurTimeout.current)
  }, [])

  useEffect(() => {
    if (!selectedPropInput || !changingProperty || changingProperty.type !== 'text') return
    if (selectedPropInput === 'name') {
      propNameInputRef.current.select()
    } else {
      propValueInputRef.current.select()
    }
    setSelectedPropInput(null)
  }, [changingProperty, selectedPropInput])

  useEffect(() => {
    return () => {
      clearTimeout(deletePromptTimeout.current)
      clearTimeout(contextMenuTimeout.current)
      clearTimeout(contextMenuTimeout2.current)
      clearTimeout(blurTimeoutRef.current)
    }
  }, [])

  return (
    <ContentContainer
      expanded={initialAnimation && link.expanded && link.items.length > 1}
      showContextMenu={showContextMenu}
    >
      <Content>
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
        {link.properties && link.properties.length > 0 && (
          <Properties
            addLinkProp={addLinkProp}
            changingProperty={changingProperty}
            deleteLinkProp={deleteLinkProp}
            enablePropChanging={enablePropChanging}
            link={link}
            onPropChange={onPropChange}
            onPropInputBlur={onPropInputBlur}
            onPropInputFocus={onPropInputFocus}
            onPropInputKeyDown={onPropInputKeyDown}
            propNameInputRef={propNameInputRef}
            propValueInputRef={propValueInputRef}
            selectedPropInput={selectedPropInput}
          />
        )}
      </Content>
      <ButtonsLauncher onClick={toggleShowContextMenu} ref={buttonsLauncherRef} />
      {showContextMenu && (
        <ContextMenu
          addLink={addLink}
          addPropAndChange={addPropAndChange}
          buttonsAnimation={buttonsAnimation}
          buttonsContainerRef={buttonsContainerRef}
          contextMenuPositionStyle={contextMenuPositionStyle}
          deleteLink={deleteLink}
          onBlur={onBlur}
          onFocus={onFocus}
          showDeletePrompt={showDeletePrompt}
          showPropertiesOptions={showPropertiesOptions}
          toggleChangeName={toggleChangeName}
          toggleChangeType={toggleChangeType}
          togglePropertyOptions={togglePropertyOptions}
        />
      )}
      {link.items.length > 0 && (
        <HasItemsIndicator expanded={link.expanded} onClick={handleExpand}>
          <span />
        </HasItemsIndicator>
      )}
    </ContentContainer>
  )
}

export default LinkContent
