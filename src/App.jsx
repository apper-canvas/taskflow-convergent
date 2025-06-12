import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/Layout'
import Home from '@/components/pages/HomePage'
import NotFound from '@/components/pages/NotFoundPage'
import { routeArray } from './config/routes'
function App() {
  return (
    <BrowserRouter>
      <Routes>
<Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/home" replace />} />
          {routeArray.map(route => (
            <Route
              key={route.id}
              path={route.path}
element={<route.component />}
            />
          ))}
<Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="z-[9999]"
        toastClassName="bg-white shadow-lg border border-surface-200"
        progressClassName="bg-gradient-to-r from-primary to-secondary"
      />
    </BrowserRouter>
  )
}

export default App