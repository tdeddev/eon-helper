const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT

const profile = require('./src/router/profile')

app.use(express.json());
app.use(cors())
app.use('/profile', profile)

app.get('/', (req, res) => {
    res.send('API OK!')
})

app.listen(port, () => console.log(`Server running Port: ${port}`))