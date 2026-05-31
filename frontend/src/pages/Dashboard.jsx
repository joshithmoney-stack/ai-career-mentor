import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [education, setEducation] = useState('11th')
  const [interest, setInterest] = useState('AI')
  const [goal, setGoal] = useState('Software Engineer')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [saving, setSaving] = useState(false)
  const [roadmaps, setRoadmaps] = useState([])

  useEffect(() => {
    if (!user) return
    fetchRoadmaps()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function fetchRoadmaps() {
    const { data, error } = await supabase
      .from('roadmaps')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (!error && data) setRoadmaps(data)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setResult('')
    try {
      const res = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ education, interest, goal })
      })
      const data = await res.json()
      setResult(data.roadmap || JSON.stringify(data))
    } catch (err) {
      setResult('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function saveRoadmap() {
    if (!result) return
    setSaving(true)
    const { error } = await supabase.from('roadmaps').insert([{ user_id: user.id, content: result }])
    setSaving(false)
    if (!error) fetchRoadmaps()
  }

  return (
    <div style={{ maxWidth: 840, margin: '28px auto', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Dashboard</h1>
        <div>
          <strong>{user?.email}</strong>
          <button onClick={() => signOut()} style={{ marginLeft: 12 }}>Log out</button>
        </div>
      </header>

      <section style={{ marginTop: 18 }}>
        <h2>Create Roadmap</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
          <label>
            Education
            <input value={education} onChange={e => setEducation(e.target.value)} style={{ width: '100%' }} />
          </label>
          <label>
            Interest
            <input value={interest} onChange={e => setInterest(e.target.value)} style={{ width: '100%' }} />
          </label>
          <label>
            Goal
            <input value={goal} onChange={e => setGoal(e.target.value)} style={{ width: '100%' }} />
          </label>
          <button type="submit" disabled={loading}>{loading ? 'Generating...' : 'Generate Roadmap'}</button>
        </form>

        <div style={{ marginTop: 16 }}>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f7f7f7', padding: 12 }}>{result}</pre>
          <button onClick={saveRoadmap} disabled={!result || saving} style={{ marginTop: 8 }}>{saving ? 'Saving...' : 'Save Roadmap'}</button>
        </div>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2>Your Saved Roadmaps</h2>
        {roadmaps.length === 0 && <div>No saved roadmaps yet.</div>}
        <ul>
          {roadmaps.map(r => (
            <li key={r.id} style={{ marginBottom: 12, background: '#fff', padding: 8, border: '1px solid #eee' }}>
              <div style={{ fontSize: 12, color: '#666' }}>{new Date(r.created_at).toLocaleString()}</div>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{r.content}</pre>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
