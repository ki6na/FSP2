const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Mood = require('./schema/mood')

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

// connect to mongodb
mongoose.connect('mongodb://127.0.0.1:27017/moodtracker')
  .then(() => {
    console.log('MongoDB connected')
    app.listen(port, () => console.log(`server running on port ${port}`))
  })
  .catch(err => console.log('connection error:', err))

// get all moods
app.get('/moods', async (req, res) => {
  try {
    const moods = await Mood.find().sort({ createdAt: -1 })
    res.json(moods)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/moods', async (req, res) => {
  try {
    const newMood = new Mood({ mood: req.body.mood })
    await newMood.save()
    const moods = await Mood.find().sort({ createdAt: -1 })
    res.json(moods)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/moods/:id', async (req, res) => {
  try {
    await Mood.findByIdAndUpdate(req.params.id, { mood: req.body.mood })
    const moods = await Mood.find().sort({ createdAt: -1 })
    res.json(moods)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/moods/:id', async (req, res) => {
  try {
    await Mood.findByIdAndDelete(req.params.id)
    const moods = await Mood.find().sort({ createdAt: -1 })
    res.json(moods)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// clear all moods
app.delete('/moods', async (req, res) => {
  try {
    await Mood.deleteMany({})
    res.json([])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})