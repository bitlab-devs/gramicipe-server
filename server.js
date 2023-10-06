/* 
    |-----------------------|
    |   Server Engine Room  |
    |-----------------------|
*/

const express = require("express")
const app = express()
const path = require("path")
const cors = require("cors")
const corsOptions = require('./config/corsOptions')

const PORT = process.env.PORT || 3500

app.use(cors(corsOptions))

app.use(express.static('public'))

app.use(express.json())

app.use('/', require('./routes/root'))

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})