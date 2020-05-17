import Portal from './portal'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
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

const Button = styled.button`
  -webkit-appearance: none;
  outline: none;
  user-select: none;

  border-radius: 4px;

  ${({ showPrompt }) =>
    showPrompt
      ? `
    color: #fff;
    box-shadow: 0px 0px 10px rgba(255,150,150,0.5);
    border: 1px solid #f88;
    background: #f88;
  `
      : `
    color: #333;
    box-shadow: 0px 5px 15px rgba(0, 50, 100, 0.2);
    border: 1px solid #777;
    background: #fff;
  `}

  &:hover,
  &:focus {
    background: ${({ showPrompt }) => (showPrompt ? '#f88' : '#fb0')};
  }

  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  white-space: nowrap;

  left: 50%;
  z-index: 12;
  padding: 3px 6px;
  cursor: pointer;

  ${({ index }) => `
    transition: 0.3s all, 0.1s color, transform 0.2s ${index / 20}s, opacity 0.2s ${index / 20}s;
  `}

  ${({ animateButtons }) => `
    transform: ${!animateButtons ? 'translateX(-30px)' : 'translateX(0px)'};
    opacity: ${!animateButtons ? 0 : 1};
    ${!animateButtons ? 'pointer-events: none;' : ''}
  `}

  & + & {
    margin-top: 2px;
  }
`

const ContextMenu = ({ contextMenuPositionStyle, setShow, show, clickMenuButton, content }) => {
  const [currentMenuContent, setCurrentMenuContent] = useState(content && content.main)
  const [promptId, setPromptId] = useState(null)
  const [animateButtons, setAnimateButtons] = useState(false)

  const buttonPromptTimeout = useRef(null)
  const buttonsFocusTimeouRef = useRef(null)
  const buttonsContainerRef = useRef(null)
  const buttonsAnimationTimeoutRef = useRef(null)
  const blurTimeoutRef = useRef(null)

  const showButtonPrompt = useCallback(buttonId => {
    setPromptId(buttonId)
    buttonPromptTimeout.current = setTimeout(() => {
      setPromptId(null)
    }, 1000)
  }, [])

  useEffect(() => {
    buttonsAnimationTimeoutRef.current = setTimeout(() => {
      setAnimateButtons(true)
    }, 20)
  }, [show])

  useEffect(() => {
    if (animateButtons || currentMenuContent) {
      buttonsFocusTimeouRef.current = setTimeout(() => {
        buttonsContainerRef.current && buttonsContainerRef.current.focus()
      }, 10)
    }
  }, [animateButtons, currentMenuContent, buttonsContainerRef])

  const onBlur = useCallback(() => {
    blurTimeoutRef.current = setTimeout(() => {
      setShow(false)
    }, 100)
  }, [setShow])

  const onButtonClick = useCallback(
    event => {
      const buttonId = event.currentTarget.getAttribute('data-button-id')
      if (!buttonId) return

      const button = currentMenuContent.find(button => button.id === buttonId)

      if (button.confirmationLabel && !promptId) {
        return showButtonPrompt(buttonId)
      }

      if (button.switchToMenu) {
        return setCurrentMenuContent(content[button.switchToMenu])
      }

      onBlur()

      clickMenuButton(buttonId)
    },
    [promptId, showButtonPrompt, clickMenuButton, currentMenuContent, content, onBlur]
  )

  useEffect(
    () => () => {
      clearTimeout(buttonPromptTimeout.current)
      clearTimeout(buttonsFocusTimeouRef.current)
      clearTimeout(blurTimeoutRef.current)
    },
    []
  )

  const onFocus = useCallback(() => {
    clearTimeout(blurTimeoutRef.current)
  }, [])

  if (!currentMenuContent) return null

  return (
    <Portal id="context-menu-portal">
      <Container style={contextMenuPositionStyle}>
        <ButtonsContainer onBlur={onBlur} onFocus={onFocus} ref={buttonsContainerRef} tabIndex="0">
          {currentMenuContent.map((button, index) => (
            <Button
              animateButtons={animateButtons}
              data-button-id={button.id}
              index={index}
              key={button.id}
              onClick={onButtonClick}
              showPrompt={promptId === button.id}
              tabIndex="0"
            >
              {promptId === button.id ? button.confirmationLabel : button.label}
            </Button>
          ))}
        </ButtonsContainer>
      </Container>
    </Portal>
  )
}

export default ContextMenu
