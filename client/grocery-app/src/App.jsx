import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

// list of moods
const MOODS = [
  { label: 'Happy', emoticon: ':)' },
  { label: 'Tired', emoticon: ':|' },
  { label: 'Stressed', emoticon: ':(' },
  { label: 'Excited', emoticon: ':))' },
]

function Header({ title }) {
  return (
    <div className="header">
      <h1>{title}</h1>
      <p className="subtitle">how are you feeling?</p>
    </div>
  )
}

function App() {
  const [mood, setMood] = useState('')
  const [moodLog, setMoodLog] = useState([])
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    axios.get('http://localhost:3000/moods')
      .then(response => setMoodLog(response.data))
  }, [])

  const chooseMood = async (newMood) => {
    setMood(newMood)

    if (editingId) {
      const response = await axios.put(`http://localhost:3000/moods/${editingId}`, { mood: newMood })
      setMoodLog(response.data)
      setEditingId(null)
    } else {
      const response = await axios.post('http://localhost:3000/moods', { mood: newMood })
      setMoodLog(response.data)
    }
  }

  const clearMoods = () => {
    axios.delete('http://localhost:3000/moods')
      .then(res => {
        setMoodLog(res.data)
        setMood('')
        setEditingId(null)
      })
  }

  return (
    <div className="app">
      <Header title="Mood Picker" />

      {editingId && (
        <p className="edit-notice">editing a past mood — pick a new one above</p>
      )}

      <div className="mood-buttons">
        {MOODS.map(({ label, emoticon }) => (
          <button
            key={label}
            className={`mood-btn ${label.toLowerCase()}${mood === label ? ' active' : ''}`}
            onClick={() => chooseMood(label)}
          >
            {emoticon} {label}
          </button>
        ))}
      </div>

      <div className="current-mood">
        <div className="label">Current mood</div>
        <div className="value">{mood || '—'}</div>
      </div>

      <div className="log-section">
        <h2>Mood log</h2>
        <ul>
          {moodLog.map((m, i) => (
            <li key={m._id || i} onClick={() => setEditingId(m._id)} className="log-item">
              {m.mood} {editingId === m._id ? '← editing' : ''}
            </li>
          ))}
        </ul>
        {moodLog.length > 0 && (
          <button className="clear-btn" onClick={clearMoods}>clear log</button>
        )}
      </div>
    </div>
  )
}

export default App