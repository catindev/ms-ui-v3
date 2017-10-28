const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const checkIn = require('./checkin')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(checkIn)

app.get('/', (request, response) => response.sendFile(__dirname + '/static/leads/template.html'))
app.get('/leads/hot', (request, response) => response.sendFile(__dirname + '/static/leads/template.html'))
app.get('/leads/cold/new', (request, response) => response.sendFile(__dirname + '/static/cold-new/template.html'))

const listener = app.listen(5003, () => console.log('Started at', listener.address().port))
