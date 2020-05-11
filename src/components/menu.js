import GearIcon from './gear-icon'
import React from 'react'
import styled from 'styled-components'

const MenuContainer = styled.div`
  width: 100px;
  position: fixed;
  background: #fff;
`

const List = styled.div``

const Link = styled.div`
  padding: 3px;
  font-size: 20px;
  cursor: pointer;
`

const Menu = () => (
  <MenuContainer>
    <List>
      <Link>
        <GearIcon />
      </Link>
    </List>
  </MenuContainer>
)

export default Menu
