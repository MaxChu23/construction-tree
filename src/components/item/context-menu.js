import ButtonBase from '../button-base'
import Portal from '../portal'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  position: absolute;
  left: 0;
  top: 0;
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

const Button = styled(ButtonBase)`
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
  white-space: nowrap;

  left: 50%;
  z-index: 12;
  padding: 3px 6px;

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

const getContextMenuStyle = (anchorElement, contextMenu) => {
  const result = {}

  const anchorClientRect = anchorElement.current.getBoundingClientRect()
  const menuClientRect = contextMenu.current.getBoundingClientRect()

  if (anchorClientRect.x + menuClientRect.width > window.innerWidth + window.scrollX) {
    result.left = anchorClientRect.x - menuClientRect.width
  } else {
    result.left = anchorClientRect.x
  }

  if (anchorClientRect.y + menuClientRect.height > window.innerHeight + window.scrollY) {
    result.top = anchorClientRect.y - menuClientRect.height
  } else {
    result.top = anchorClientRect.y
  }

  return result
}

const ContextMenu = ({ setShow, show, clickMenuButton, content, anchorElement }) => {
  const [currentMenuContent, setCurrentMenuContent] = useState(content && content.main)
  const [promptId, setPromptId] = useState(null)
  const [animateButtons, setAnimateButtons] = useState(false)
  const [showContainer, setShowContainer] = useState(false)
  // Without this line it will be visible in the top-left corner of the screen right after starting animation!
  const [containerStyle, setContainerStyle] = useState({ opacity: 0 })

  const buttonsContainerRef = useRef(null)

  const buttonPromptTimeout = useRef(null)
  const buttonsFocusTimeouRef = useRef(null)
  const buttonsAnimationTimeoutRef = useRef(null)
  const blurTimeoutRef = useRef(null)
  const showContainerTimeoutRef = useRef(null)

  useEffect(() => {
    if (!animateButtons) return
    if (!anchorElement || !anchorElement.current || !buttonsContainerRef || !buttonsContainerRef.current) return

    setTimeout(() => {
      const style = getContextMenuStyle(anchorElement, buttonsContainerRef)
      setContainerStyle(style)
    }, 40)
  }, [animateButtons, anchorElement])

  const showButtonPrompt = useCallback(buttonId => {
    setPromptId(buttonId)
    buttonPromptTimeout.current = setTimeout(() => {
      setPromptId(null)
    }, 1000)
  }, [])

  useEffect(() => {
    clearTimeout(showContainerTimeoutRef.current)
    clearTimeout(buttonsAnimationTimeoutRef.current)

    showContainerTimeoutRef.current = setTimeout(
      () => {
        setShowContainer(show)
      },
      show ? 0 : 1000
    )
    buttonsAnimationTimeoutRef.current = setTimeout(() => {
      setAnimateButtons(show)
    }, 30)
  }, [show])

  useEffect(() => {
    if (!showContainer) {
      setCurrentMenuContent(content && content.main)
    }
  }, [content, showContainer])

  useEffect(() => {
    if (!show) return
    if (animateButtons || currentMenuContent) {
      buttonsFocusTimeouRef.current = setTimeout(() => {
        buttonsContainerRef.current && buttonsContainerRef.current.focus()
      }, 10)
    }
  }, [animateButtons, currentMenuContent, buttonsContainerRef, show])

  const onBlur = useCallback(() => {
    blurTimeoutRef.current = setTimeout(() => {
      setShow(false)
    }, 0)
  }, [setShow])

  const onButtonClick = useCallback(
    event => {
      const buttonId = event.currentTarget.getAttribute('data-button-id')
      if (!buttonId || !currentMenuContent) return

      const button = currentMenuContent.find(button => button.id === buttonId)

      if (button.confirmationLabel && !promptId) {
        return showButtonPrompt(buttonId)
      }

      if (button.switchToMenu && content) {
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
      clearTimeout(showContainerTimeoutRef.current)
    },
    []
  )

  const onFocus = useCallback(() => {
    clearTimeout(blurTimeoutRef.current)
  }, [])

  if (!showContainer || !currentMenuContent) return null

  return (
    <Portal id="context-menu-portal">
      <Container style={containerStyle}>
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
