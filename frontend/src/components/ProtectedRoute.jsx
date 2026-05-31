import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading-shell" style={{ padding: 24, textAlign: 'center' }}>Loading session…</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
