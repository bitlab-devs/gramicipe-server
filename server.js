/* 
    |-----------------------|
    |   Server Engine Room  |
    |-----------------------|
*/

require('dotenv').config();
const express = require("express")
const app = express()
const path = require("path")
const cors = require("cors")
const corsOptions = require('./config/corsOptions')
const { logger, logEvents } = require('./middlewares/logger')
const errorHandler = require('./middlewares/errorHandler')
const connectDB = require('./config/dbConnect')
const mongoose = require('mongoose')

const PORT = process.env.PORT || 3500

connectDB()

app.use(cors(corsOptions))

app.use(express.static('public'))

app.use(express.json())

app.use('/', require('./routes/root'))

// 404 CONFIGURATION
app.all('*', (req, res) => {
    res.status(404) // Not found
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: "404 error Not found" })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)

// Database connection and server listening
mongoose.connection.once('open', () => {
    console.log('Connected to the Database')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
