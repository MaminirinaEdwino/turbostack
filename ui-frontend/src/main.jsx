import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { store } from './store.js'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { PreviewApp } from './PreviewApp.jsx'

const isPreviewMode = window.location.search.includes('mode=preview') || 
                      window.location.hash === '#preview';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      {isPreviewMode ? <PreviewApp/> : <App />}
    </Provider>
  </StrictMode>,
)
