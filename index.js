const express = require('express')
require('dotenv').config()
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const connectDB = require('./config/db.js')
const port = process.env.PORT

app.use(cors())

app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api/jogos', require('./routes/api/jogo'))
app.use('/api/user', require('./routes/api/user'))

app.use (function (req, res, next) {
    var schema = (req.headers['x-forwarded-proto'] || '').toLowerCase();
    if (req.headers.host.indexOf('localhost') < 0 && schema !== 'https') {
        res.redirect('https://' + req.headers.host + req.url);
    }
    next();
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname))
})

connectDB()

app.listen(port, () => console.log(`Port: ${port}`))


