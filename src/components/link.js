import React, { useCallback, useMemo, useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { findTreeLink } from '../utils'
import Portal from './portal'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  outline: none;
  position: relative;

  opacity: ${({ initialAnimation }) => initialAnimation ? 1 : 0 };
  transform: translateY(${({ initialAnimation }) => initialAnimation ? 0 : 10 }px);
  transition: all 0.3s;

  & + & {
    ${({ isPrimary }) => !isPrimary ? 'margin-left: 10px;' : ''}
  }

  ${({ isPrimary, isLast, isFirst, initialAnimation }) => !isPrimary && `
    margin-top: 50px;
    &::before {
      content: '';
      position: absolute;
      top: ${isFirst && isLast ? '-50px' : '-20px'};
      width: 1px;
      height: ${isFirst && isLast ? '50px' : '20px'};
      background: #777;
      transition: transform 0.2s ${isFirst && isLast ? '' : '0.4s'} ease-out;
      transform: scaleY(${initialAnimation ? 1 : 0});
      transform-origin: top;
    }
    ${!(isLast && isFirst) ? `

      &::after {
        content: '';
        position: absolute;
        top: -20px;
        left: ${isLast ? 0 : (!isFirst ? '0' : '50%')};
        right: ${isLast ? '50%' : '-10px' };
        height: 1px;
        background: #777;
        transition: transform 0.2s 0.2s linear;
        transform: scaleX(${initialAnimation ? 1 : 0});
        transform-origin: ${isLast ? 'left' : 'right' };
      }
      ` : ''}
  `}
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

  box-shadow: 0px 3px 6px rgba(0,0,0,0.3);
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
  ${({ showContextMenu }) => !showContextMenu ? `
    &:hover {
      ${ButtonsLauncher} {
        transform: scale(1);
        opacity: 1;
      }
    }
  ` : `${ButtonsLauncher} { transform: scale(1); opacity: 1; }`}
`

const Input = styled.input`
  -webkit-appearance: none;
  outline: none;
  border: none;
  padding: 2px 10px;
  display: block;
  margin: 0 auto;
  text-align: center;
  font-size: 14px;

  font-weight: 700;
  color: ${({ color }) => color };

  background: transparent;

  &[data-rename="type"] {
    text-transform: uppercase;
    font-size: 12px;
  }
`

const ButtonsContainerPos = styled.div`
  position: absolute;
`

const ButtonsContainer = styled.div`
  display: flex;
  position: absolute;
  justify-content: center;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 10px;
  z-index: 10;
  outline: none;
`

const TypeContainer = styled.div`
  background: linear-gradient(-45deg,#88ffe4,#5874ff);
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

const ItemsContainer = styled.div`
  display: flex;
`

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

const Button = styled.button`
  -webkit-appearance: none;
  color: ${({ isRed }) => isRed ? '#fff' : '#333'};
  outline: none;
  border: 1px solid ${({ isRed }) => isRed ? "#f88" : "#777"};
  border-radius: 4px;
  ${({ animation }) => animation !== 'show' && 'pointer-events: none;'}
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);

  &:hover, &:focus {
    background: ${({ isRed }) => isRed ? "#f88" : "#fb0"};
  }

  background: ${({ isRed }) => isRed ? "#f88" : "#fff"};
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  white-space: nowrap;

  left: 50%;
  z-index: 12;
  padding: 3px 6px;
  cursor: pointer;
  user-select: none;
  ${({ index}) => `
    transition: 0.3s all, 0.1s color, transform 0.2s ${index / 20}s, opacity 0.2s ${index / 20}s;
  `}

  ${({ animation }) => `
    transform: ${animation === 'hide' ? 'translateX(-30px)' : 'translateX(0px)' };
    opacity: ${animation === 'hide' ? 0 : 1 };
  `}

  & + & {
    margin-top: 2px;
  }

  ${({ isRed }) => isRed && 'box-shadow: 0px 0px 10px rgba(255,150,150,0.5);'}
`

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
    color: ${({ expanded }) => expanded ? '#777' : '#0bf'};
    user-select: none;
    background: #fff;
    border-radius: 50%;
    text-align: center;
    border: 1px solid ${({ expanded }) => expanded ? '#777' : 'rgba(100,200,255,0.5)'};

    transition: 0.3s all;

    ${({ expanded }) => !expanded && `box-shadow: 0px 0px 5px 1px rgba(100, 200, 255, 0.5);`}

    ${({ expanded }) => expanded ? `
      animation: 0.6s hasNoItems;
      animation-fill-mode: forwards;
    ` : `
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
      transform: translateX(-50%) scale(${({ expanded }) => expanded ? 0 : 1});
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
  left: 0;
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

function isTextSelected(input) {
    if (typeof input.selectionStart == "number") {
        return input.selectionStart === 0 && input.selectionEnd === input.value.length;
    } else if (typeof document.selection != "undefined") {
        input.focus();
        return document.selection.createRange().text === input.value;
    }
}

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

const Link = ({ link, treeData, setTreeData, isPrimary, isLast, renaming, setRenaming, isFirst }) => {
  const [showContextMenu, setShowContextMenu] = useState(false)
  const renamingType = useMemo(() => renaming && (renaming.id === link.id && renaming.type), [link.id, renaming])

  const [showDeletePrompt, setShowDeletePrompt] = useState(false)
  const [buttonsAnimation, setButtonsAnimation] = useState('hide')
  const [initialAnimation, setInitialAnimation] = useState(false)
  const [showPropertiesOptions, setShowPropertiesOptions] = useState(false)
  const [changingProperty, setChangingProperty] = useState(null)

  const buttonsLauncherRef = useRef(null)
  const buttonsContainerRef = useRef(null)
  const propNameInputRef = useRef(null)
  const propValueInputRef = useRef(null)

  const deletePromptTimeout = useRef(null)
  const contextMenuTimeout = useRef(null)
  const contextMenuTimeout2 = useRef(null)
  const animationTimer = useRef(null)
  const blurTimeoutRef = useRef(null)

  const toggleShowContextMenu = useCallback(({ blur } = {}) => {
    clearTimeout(contextMenuTimeout.current)
    clearTimeout(contextMenuTimeout2.current)

    contextMenuTimeout.current = setTimeout(() => {
      if (blur) {
        setShowContextMenu(false)
        setShowPropertiesOptions(false)
        return
      }
      setShowContextMenu(buttonsAnimation === 'hide')
    }, blur || buttonsAnimation !== 'hide' ? 1000 : 10 )

    contextMenuTimeout2.current = setTimeout(() => {
      setButtonsAnimation(buttonsAnimation === 'hide' ? 'show' : 'hide')
    }, 50)
  }, [buttonsAnimation, setShowContextMenu])

  const addLink = useCallback(() => {
    const newTreeData = [ ...treeData ]

    var newLink = findTreeLink({ items: newTreeData, id: link.id })
    if (!newLink) return

    const obj = {
      id: newLink.item.id + '.' + newLink.item.items.length,
      type: "",
      name: "",
      expanded: false,
      items: []
    }

    newLink.item.items.push(obj)
    newLink.item.expanded = true;

    setTreeData(newTreeData)
    setRenaming({ id: obj.id, type: "type", value: "" })
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

    const newTreeData = [ ...treeData ]

    var newLink = findTreeLink({ items: newTreeData, id: link.id })
    if (!newLink) return

    const index = newLink.items.indexOf(newLink.item)
    if (index === -1) return

    newLink.items.splice(index, 1)

    setTreeData(newTreeData)
    toggleShowContextMenu()
  }, [link.id, setTreeData, treeData, toggleShowContextMenu, showDeletePrompt])

  useEffect(() => {
    return () => {
      clearTimeout(animationTimer.current)
      clearTimeout(deletePromptTimeout.current)
      clearTimeout(contextMenuTimeout.current)
      clearTimeout(contextMenuTimeout2.current)
      clearTimeout(blurTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    animationTimer.current = setTimeout(() => {
      setInitialAnimation(true)
    }, 50)
  }, [])

  const handleExpand = useCallback(() => {
    const newTreeData = [ ...treeData ]

    const newLink = findTreeLink({ items: newTreeData, id: link.id })
    if (!newLink) return

    newLink.item.expanded = !link.expanded

    setTreeData(newTreeData)
  }, [link.expanded, link.id, treeData, setTreeData])

  const renameLink = useCallback(event => {
    const value = event.target.value

    const newTreeData = [ ...treeData ]

    var newLink = findTreeLink({ items: newTreeData, id: link.id })
    if (!newLink || !renaming) return

    newLink.item[renaming.type] = value

    setRenaming(link.name === '' ? {id: link.id, type: "name", value: ""} : null )
    setTreeData(newTreeData)
  }, [renaming, link, treeData, setTreeData, setRenaming])

  const addLinkProp = useCallback(prop => {
    const newTreeData = [ ...treeData ]

    var newLink = findTreeLink({ items: newTreeData, id: link.id })
    if (!newLink) return

    const newLinkProp = {...prop}
    const props = newLink.item.properties || []

    newLinkProp.id = props.length + 1

    // TODO: desctruct the object first!
    newLink.item.properties = [...props, newLinkProp]

    setTreeData(newTreeData)
    return newLinkProp
  }, [link, treeData, setTreeData])

  const updateLinkProp = useCallback(prop => {
    const newTreeData = [ ...treeData ]
    const propData = { ...prop }

    var newLink = findTreeLink({ items: newTreeData, id: link.id })
    if (!newLink) return
    var newLinkPropIndex = newLink.item.properties.findIndex(item => item.id === propData.id)
    if (newLinkPropIndex === -1) return

    if (prop.name === '' && prop.value === '') {
      newLink.item.properties.splice(newLinkPropIndex, 1)
    } else {
      propData.value = propData.type === 'boolean' ? propData.value === 'true' : propData.value
      newLink.item.properties[newLinkPropIndex] = { ...newLink.item.properties[newLinkPropIndex], ...propData }
    }

    setTreeData(newTreeData)
    return newLink.item.properties[newLinkPropIndex]
  }, [link, treeData, setTreeData])

  const toggleChangeName = useCallback(() => {
    setRenaming({ id: link.id, type: "name", value: link.name })
  }, [setRenaming, link.id, link.name])

  const toggleChangeType = useCallback(() => {
    setRenaming({ id: link.id, type: "type", value: link.type })
  }, [setRenaming, link.id, link.type])

  const onInputKeyDown = useCallback(event => {
    if (event.key === 'Enter') {
      renameLink(event)
    }
  }, [renameLink])

  const onBlur = useCallback((e) => {
    blurTimeoutRef.current = setTimeout(() => {
      toggleShowContextMenu({ blur: true })
    }, 100)
  }, [toggleShowContextMenu])

  const onFocus = useCallback(() => {
    clearTimeout(blurTimeoutRef.current)
  }, [])

  const onInputChange = useCallback(event => {
    setRenaming({ ...renaming, value: event.target.value })
  }, [renaming, setRenaming])

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

  const addPropAndChange = useCallback(event => {
    onBlur()

    const type = event.target.getAttribute('data-prop-type')
    const defaultValues = {
      text: '',
      boolean: false,
      list: []
    }
    const value = defaultValues[type]
    const prop = {
      type,
      name: '',
      value,
    }
    const newProp = addLinkProp(prop)
    setChangingProperty(newProp)
  }, [onBlur, addLinkProp])

  const onOkButtonClick = useCallback(() => {
    updateLinkProp(changingProperty)
    setChangingProperty(null)
  }, [changingProperty, updateLinkProp])

  const onPropInputKeyDown = useCallback(event => {
    if (event.key === 'Enter') {
      onOkButtonClick()
    }
  }, [onOkButtonClick])

  const onPropChange = useCallback(event => {
    const type = event.target.getAttribute('data-prop-type')
    setChangingProperty({ ...changingProperty, [type]: event.target.value })
  }, [changingProperty])

  const [selectedPropInput, setSelectedPropInput] = useState(null)

  const enablePropChanging = useCallback(event => {
    const propId = event.currentTarget.getAttribute('data-prop-id')
    if (!propId) return
    setChangingProperty(link.properties.find(prop => prop.id === +propId))
    const type = event.target.getAttribute('data-prop-type')
    if (type) {
      setSelectedPropInput(type)
    }
  }, [link])

  useEffect(() => {
    if (!selectedPropInput || (!changingProperty || changingProperty.type !== 'text')) return
    if (selectedPropInput === 'name') {
      propNameInputRef.current.select()
    } else {
      propValueInputRef.current.select()
    }
    setSelectedPropInput(null)
  }, [changingProperty, selectedPropInput])

  const propBlurTimeout = useRef(null)

  const onPropInputBlur = useCallback(event => {
    propBlurTimeout.current = setTimeout(() => {
      onOkButtonClick()
    }, 50)
  }, [onOkButtonClick])

  const onPropInputFocus = useCallback(event => {
    if (changingProperty.type === 'text' && !isTextSelected(event.currentTarget)) {
      event.currentTarget.select()
    }
    clearTimeout(propBlurTimeout.current)
  }, [changingProperty])

  return (
    <Container initialAnimation={initialAnimation} isFirst={isFirst} isLast={isLast} isPrimary={isPrimary} >
      <ContentContainer showContextMenu={showContextMenu} expanded={initialAnimation && link.expanded && link.items.length > 1} >
        <Content draggable>
          <TypeContainer onDoubleClick={toggleChangeType} >
            {renamingType === "type" ? <Input tabIndex="1" onKeyDown={onInputKeyDown} autoFocus data-rename="type" onChange={onInputChange} onBlur={renameLink} value={renaming.value} color={"#fff"} /> : <Type>{link.type}</Type>}
          </TypeContainer>
          {renamingType === "name" ? <Input tabIndex="1" onKeyDown={onInputKeyDown} autoFocus data-rename="name" onChange={onInputChange} onBlur={renameLink} value={renaming.value} type="name" color={"#333"} /> : <Name onDoubleClick={toggleChangeName}>{link.name}</Name>}
          {link.properties && link.properties.length > 0 &&
            <Properties link={link} changingProperty={changingProperty} enablePropChanging={enablePropChanging} onPropInputFocus={onPropInputFocus} onPropInputBlur={onPropInputBlur} propNameInputRef={propNameInputRef} propValueInputRef={propValueInputRef} onPropChange={onPropChange} onPropInputKeyDown={onPropInputKeyDown}></Properties>
          }
        </Content>
          <ButtonsLauncher ref={buttonsLauncherRef} onClick={toggleShowContextMenu} />
          {showContextMenu &&
            <Portal id="context-menu-portal" >
              <ButtonsContainerPos style={contextMenuPositionStyle} >
                <ButtonsContainer ref={buttonsContainerRef} tabIndex="1" onFocus={onFocus} onBlur={onBlur}>
                  {showPropertiesOptions ?
                    <>
                      <Button tabIndex="2" animation={buttonsAnimation} index={1} data-prop-type="text" onClick={addPropAndChange} >{"Text"}</Button>
                      <Button tabIndex="3" animation={buttonsAnimation} index={2} data-prop-type="boolean" onClick={addPropAndChange} >{"Boolean"}</Button>
                      <Button tabIndex="4" animation={buttonsAnimation} index={3} data-prop-type="list" onClick={addPropAndChange} >{"List"}</Button>
                      <Button tabIndex="5" animation={buttonsAnimation} index={4} onClick={togglePropertyOptions} >{"Cancel"}</Button>
                    </>
                      :
                    <>
                      <Button tabIndex="2" animation={buttonsAnimation} index={1} onClick={addLink} >{"Add Item"}</Button>
                      <Button tabIndex="3" animation={buttonsAnimation} index={2} isRed={showDeletePrompt} onClick={deleteLink} >{showDeletePrompt ? "Are you sure?" : "Delete"}</Button>
                      <Button tabIndex="4" animation={buttonsAnimation} index={3} onClick={toggleChangeType} >{"Change Type"}</Button>
                      <Button tabIndex="5" animation={buttonsAnimation} index={4} onClick={toggleChangeName} >{"Change Name"}</Button>
                      <Button tabIndex="6" animation={buttonsAnimation} index={5} onClick={togglePropertyOptions} >{"Add Property"}</Button>
                    </>
                  }
                </ButtonsContainer>
              </ButtonsContainerPos>
            </Portal>
          }
        {
          link.items.length > 0 &&
          (
            <HasItemsIndicator expanded={link.expanded} onClick={handleExpand} >
              <span />
            </HasItemsIndicator>
          )
        }
      </ContentContainer>
      <ItemsContainer>
        {link.expanded && link.items.map((branch, branchIndex) => (
          <Link isFirst={branchIndex === 0} isLast={branchIndex === link.items.length - 1} renaming={renaming} setRenaming={setRenaming} key={branch.id} link={branch} treeData={treeData} setTreeData={setTreeData} />
        ))}
      </ItemsContainer>
    </Container>
  )
}

export default Link
