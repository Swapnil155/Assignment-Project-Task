const express = require('express')
const cors = require('cors')
require('dotenv').config()
require('./Database/DB')

const app = express()

const PORT = process.env.PORT

app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`)
})