import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import './index.css'


const clientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '667973662276-clgm0u6d33an3eo94fs1r3dtm14mofmj.apps.googleusercontent.com'

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={clientId}>
    <StrictMode>
      <App />
    </StrictMode>
  </GoogleOAuthProvider>
)