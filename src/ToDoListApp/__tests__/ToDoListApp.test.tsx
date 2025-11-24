import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeProvider } from 'styled-components'
import { ToDoListApp } from '../ToDoListApp'
import { theme } from '../../theme'

describe('ToDoListApp', () => {
  it('does not add items with less than 3 characters', () => {
    render(
      <ThemeProvider theme={theme}>
        <ToDoListApp />
      </ThemeProvider>
    )
    const input = screen.getByPlaceholderText(/add new task/i)
    const addButton = screen.getByRole('button', { name: /add/i })

    fireEvent.change(input, { target: { value: 'hi' } })
    expect(addButton).toBeDisabled()

    fireEvent.change(input, { target: { value: 'hey' } })
    expect(addButton).toBeEnabled()
  })

  it('allows user to edit item title', () => {
    render(
      <ThemeProvider theme={theme}>
        <ToDoListApp />
      </ThemeProvider>
    )
    
    const editButtons = screen.getAllByTitle('Edit item')
    fireEvent.click(editButtons[0])
    
    const editInput = screen.getByDisplayValue('Build todo app')
    fireEvent.change(editInput, { target: { value: 'Build amazing todo app' } })
    
    const saveButtons = screen.getAllByTitle('Save')
    fireEvent.click(saveButtons[0])
    
    expect(screen.getByText('Build amazing todo app')).toBeInTheDocument()
    expect(screen.queryByText('Build todo app')).not.toBeInTheDocument()
  })

  it('allows user to delete an item', () => {
    render(
      <ThemeProvider theme={theme}>
        <ToDoListApp />
      </ThemeProvider>
    )
    
    expect(screen.getByText('Buy groceries')).toBeInTheDocument()
    
    const deleteButtons = screen.getAllByTitle('Delete item')
    fireEvent.click(deleteButtons[1])
    
    expect(screen.queryByText('Buy groceries')).not.toBeInTheDocument()
  })
})
