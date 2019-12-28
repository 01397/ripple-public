const express = require('express')
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => res.send('Hello World!?'))

app.get('/test', (req, res) => {
  result = {
    timestamp: new Date().toUTCString(),
    message: 'Hello everyone!!?',
  }
  res.json(result)
})
