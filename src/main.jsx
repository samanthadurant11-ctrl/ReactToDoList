import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToDoListApp } from './ToDoListApp/ToDoListApp'
import { ThemeProvider } from 'styled-components'
import { theme } from './theme'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <ToDoListApp />
    </ThemeProvider>
  </StrictMode>,
)
