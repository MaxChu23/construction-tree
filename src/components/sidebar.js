import React, { useCallback, useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background: #fff;
  color: #333;
  padding-top: 50px;
  width: 300px;
  height: 100vh;
  z-index: 1000;
  transition: all 0.3s;
  box-shadow: 3px 0px 20px rgba(0, 50, 100, 0.2);

  ${({ isOpen }) => !isOpen && 'transform: translateX(-300px); opacity: 0;'}

  hr {
    border-top: 0;
    border-bottom-color: #f5f5f5;
  }
`

const ScrollContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  padding: 0 20px 20px;
`

const SidebarButton = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: #fff;
  width: 24px;
  height: 24px;
  z-index: 1001;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0px 3px 10px rgba(0, 50, 100, 0.25);

  transform: ${({ isOpen }) => (isOpen ? 'translateX(250px)' : 'translateX(0)')};
  display: flex;
  justify-content: center;
  align-items: center;

  div {
    opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  }

  span {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #58f;
    & + span {
      margin-left: 2px;
    }

    transition: all 0.3s;

    ${({ isOpen }) => isOpen && 'opacity: 0;'}
  }
`

const Cross = styled.div`
  position: absolute;
  top: 50%;
  left: 27%;
  transform: translate(-50%, -50%);
  transform: rotate(-45deg);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 10px;
    height: 2px;
    background: #58f;
    transition: all 0.2s;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 2px;
    height: 10px;
    background: #58f;
    transition: all 0.2s;
  }
`

const Tutorial = () => (
  <div>
    <h2>{'Tutorial'}</h2>
    <p>{'This is a multifunctional tree. You can do all sorts of things with it.'}</p>
    <hr />
    <h3>{'Item'}</h3>
    <p>{'You can create, change and remove items as you wish. To do so use the context menu:'}</p>
    <p>
      {`Hover over an item to see its context menu in the top-right corner of the item element (on mobile devices it will appear by default, you don't need to hover).
        It will appear as a small white circle with a rhombus inside.`}
    </p>
    <p>{'To change the item fields you need to click a corresponding button in its context menu.'}</p>
    <hr />
    <h3>{'Item properties'}</h3>
    <p>{'Create new properties by:'}</p>
    <ul>
      <li>{'Click on the Context Menu of an Item;'}</li>
      <li>{'Go to properties;'}</li>
      <li>{'Choose property type;'}</li>
    </ul>
    <p>{"Now, when the property is created, you can change it's key and value;"}</p>
    <p>{'You can also sort properties by dragging them. It works for cross-item sorting as well :)'}</p>
    <hr />
    <h3>{'Sorting'}</h3>
    <p>{'You can sort items by dragging them to the place you want using your mouse.'}</p>
    <hr />
    <h3>{'Author'}</h3>
    <p>{'Made with 💖 by MaxChu23 (mymaksym@gmail.com)'}</p>
  </div>
)

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = useCallback(() => {
    setIsOpen(!isOpen)
  }, [isOpen])

  return (
    <>
      <SidebarButton isOpen={isOpen} onClick={toggleSidebar}>
        <span />
        <span />
        <span />
        <Cross />
      </SidebarButton>
      <Container isOpen={isOpen}>
        <ScrollContainer>
          <Tutorial />
        </ScrollContainer>
      </Container>
    </>
  )
}

export default Sidebar
