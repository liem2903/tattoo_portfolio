import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { PublicPage } from './pages/PublicPage'

// Admin code (upload, QR, login) is only downloaded when visiting /admin.
const AdminPage = lazy(() => import('./pages/AdminPage').then((m) => ({ default: m.AdminPage })))

export function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicPage />} />
      <Route
        path="/admin"
        element={
          <Suspense fallback={null}>
            <AdminPage />
          </Suspense>
        }
      />
      <Route path="*" element={<PublicPage />} />
    </Routes>
  )
}
