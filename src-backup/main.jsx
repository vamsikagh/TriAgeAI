import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { TriageProvider } from './context/TriageContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <TriageProvider>
        <App />
      </TriageProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
