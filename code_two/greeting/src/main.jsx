import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './CompanyCard.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
