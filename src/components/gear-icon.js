import styled from 'styled-components'

const GearIcon = styled.div`
  width: 0.5em;
  height: 0.5em;
  position: relative;
  border-radius: 100%;
  background-color: transparent;
  border-width: 0.07em;
  border-style: solid;
  border-color: transparent;
  margin: 0.25em;
  box-shadow: 0 0 0 0.1em, inset 0 0 0 0.3em;

  &::before {
    content: '';
    position: absolute;
    width: 0.18em;
    height: 0.18em;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0.41em 0, -0.41em 0, 0 0.41em, 0 -0.41em;
  }

  &::after {
    content: '';
    position: absolute;
    width: 0.18em;
    height: 0.18em;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%) rotate(45deg);
    -ms-transform: translate(-50%, -50%) rotate(45deg);
    transform: translate(-50%, -50%) rotate(45deg);
    -webkit-box-shadow: 0.42em 0, -0.42em 0, 0 0.42em, 0 -0.42em;
    box-shadow: 0.42em 0, -0.42em 0, 0 0.42em, 0 -0.42em;
  }
`

export default GearIcon
