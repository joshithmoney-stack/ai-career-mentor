import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data, error } = await signUp(email, password)
    setLoading(false)
    if (error) setError(error.message)
    else {
      // Depending on Supabase settings, the user may need to confirm their email.
      // If a session was returned, navigate to dashboard.
      if (data?.user) navigate('/dashboard')
      else navigate('/login')
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Sign up</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <label>
          Email
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>
        <button type="submit" disabled={loading}>{loading ? 'Signing up...' : 'Create account'}</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </form>
      <p style={{ marginTop: 12 }}>Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  )
}
