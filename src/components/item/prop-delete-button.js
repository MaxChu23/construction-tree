import ButtonBase from '../button-base'
import styled from 'styled-components'

const PropDeleteButton = styled(ButtonBase)`
  position: absolute;
  top: 0px;
  left: -6px;
  padding: 0;
  width: 14px;
  height: 14px;
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

export default PropDeleteButton
