import { RouterProvider } from "react-router"
import { Toaster } from 'react-hot-toast'
import { router } from "./routes"

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#0d0e14',
            color: '#d1d5db',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '12px',
            fontSize: '13px',
            backdropFilter: 'blur(12px)',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#0d0e14' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#0d0e14' },
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  )
}

export default App