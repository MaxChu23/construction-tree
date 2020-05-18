import App from './App'
import React from 'react'
import { render } from '@testing-library/react'

it('findTreeItem', () => {
  const { getByText } = render(<App />)
  const itemElement = getByText(/Wunderwaffe/i)
  expect(itemElement).toBeInTheDocument()
})
