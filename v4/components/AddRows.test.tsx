import React from 'react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { act, render, screen } from '@testing-library/react'
import { AddRows } from './AddRows'

test('Has correct classes', () => {
  render(<AddRows addRows={() => null} />)
  const button = screen.getByRole('button')
  const input = screen.getByRole('spinbutton')

  expect(button).toHaveClass('dsg-add-row-btn')
  expect(input).toHaveClass('dsg-add-row-input')
})

test('Calls addRows', () => {
  const addRows = jest.fn()
  render(<AddRows addRows={addRows} />)
  const button = screen.getByRole('button')
  const input = screen.getByRole('spinbutton')

  userEvent.click(button)
  expect(addRows).toHaveBeenLastCalledWith(1)

  userEvent.type(input, '{selectall}5')
  userEvent.click(button)
  expect(addRows).toHaveBeenLastCalledWith(5)

  userEvent.type(input, '{selectall}{backspace}{enter}')
  expect(addRows).toHaveBeenLastCalledWith(1)
})

test('Resets on blur when value is invalid', () => {
  render(<AddRows addRows={() => null} />)
  const input = screen.getByRole('spinbutton') as HTMLInputElement
  // Force the input to be of type "text" to test what happens if the user types in non-number characters
  input.type = 'text'

  act(() => {
    userEvent.type(input, '{selectall}{backspace}')
    input.blur()
  })
  expect(input.value).toBe('1')

  act(() => {
    userEvent.type(input, '{selectall}456xyz')
    input.blur()
  })
  expect(input.value).toBe('456')

  act(() => {
    userEvent.type(input, '{selectall}abc')
    input.blur()
  })
  expect(input.value).toBe('1')
})
