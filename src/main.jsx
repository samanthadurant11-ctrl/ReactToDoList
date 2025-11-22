import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToDoListApp } from './ToDoListApp/App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToDoListApp />
  </StrictMode>,
)
