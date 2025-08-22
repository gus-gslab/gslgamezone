
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <App />
    <Toaster 
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          duration: 2000,
          iconTheme: {
            primary: '#22c55e',
            secondary: '#fff',
          },
        },
      }}
    />
  </>,
)
