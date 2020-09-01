const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const connectDB = require('./config/db.js')
const port = 3001

app.use(cors())

app.use(express.json())
app.use(bodyParser.urlencoded())
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api/jogos', require('./routes/api/jogo'))
app.use('/api/user', require('./routes/api/user'))

connectDB()

app.listen(port, () => console.log(`Localhost at ${port}`))


