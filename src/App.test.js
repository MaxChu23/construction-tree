import App from './App'
import React from 'react'
import { render } from '@testing-library/react'

it('findTreeLink', () => {
  const { getByText } = render(<App />)
  const linkElement = getByText(/Wunderwaffe/i)
  expect(linkElement).toBeInTheDocument()
})
