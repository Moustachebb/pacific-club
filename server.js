import express from 'express'
import cors from 'cors'
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))

app.get('/', (req, res) => {
  res.send('API ONLINE')
})

app.post('/event', async (req, res) => {
  try {
    console.log('EVENT RECEIVED')

    const response = await fetch(
      'https://discord.com/api/webhooks/1501915058815504485/7k7562xwZUBJNXAXlvKLD1iXlpNgyXiMXrvg5Z7K67MwfJoJ2e8D0hbScpW9eQBuZ-hS',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      }
    )

    console.log('DISCORD STATUS', response.status)

    res.json({
      success: true,
      status: response.status,
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      success: false,
    })
  }
})

app.listen(3001, () => {
  console.log('API ON PORT 3001')
})