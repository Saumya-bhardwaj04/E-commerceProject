import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Toaster
            position="top-center"
            toastOptions={{
                duration: 5000,
                style: {
                    background: "#111827",
                    color: "#fff",
                    borderRadius: "10px",
                    padding: "14px 16px",
                    fontSize: "14px",
                },
            }}
        />
        <CartProvider>
            <App />
        </CartProvider>
    </StrictMode>
)
