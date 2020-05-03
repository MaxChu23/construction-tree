import styled from 'styled-components'

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

export default Input
