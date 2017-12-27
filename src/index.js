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
app.get('/leads/hot/:id', (request, response) => response.sendFile(__dirname + '/static/hot-profile/template.html'))
app.get('/leads/hot/:id/reject', (request, response) => response.sendFile(__dirname + '/static/hot-reject/template.html'))
app.get('/leads/hot/:id/edit', (request, response) => response.sendFile(__dirname + '/static/hot-edit/template.html'))

app.get('/leads/cold', (request, response) => response.sendFile(__dirname + '/static/cold-leads/template.html'))
app.get('/leads/cold/new', (request, response) => response.sendFile(__dirname + '/static/cold-new/template.html'))
app.get('/leads/cold/:id', (request, response) => response.sendFile(__dirname + '/static/cold-profile/template.html'))
app.get('/leads/cold/:id/reject', (request, response) => response.sendFile(__dirname + '/static/cold-reject/template.html'))
app.get('/leads/cold/:id/edit', (request, response) => response.sendFile(__dirname + '/static/cold-edit/template.html'))

app.get('/customers', (request, response) => response.sendFile(__dirname + '/static/customers/template.html'))
app.get('/customers/today', (request, response) => response.sendFile(__dirname + '/static/customers-today/template.html'))
app.get('/customers/:id', (request, response) => response.sendFile(__dirname + '/static/customer-profile/template.html'))
app.get('/customers/:id/profile', (request, response) => response.sendFile(__dirname + '/static/customer-profile-details/template.html'))
app.get('/customers/:id/set.task', (request, response) => response.sendFile(__dirname + '/static/customer-set-task/template.html'))
app.get('/customers/:id/reject', (request, response) => response.sendFile(__dirname + '/static/customer-reject/template.html'))
app.get('/customers/:id/deal', (request, response) => response.sendFile(__dirname + '/static/customer-deal/template.html'))
app.get('/customers/:id/edit', (request, response) => response.sendFile(__dirname + '/static/customer-edit/template.html'))

app.get('/closed', (request, response) => response.sendFile(__dirname + '/static/closed/template.html'))
app.get('/closed/:id', (request, response) => response.sendFile(__dirname + '/static/closed-profile/template.html'))

app.get('/recents', (request, response) => response.sendFile(__dirname + '/static/recent-calls/template.html'))

app.get('/exit', (request, response) => {
    const { query: { msid } } = request
    response.clearCookie('msid')
    response.redirect('/')
})

const listener = app.listen(5003, () => console.log('Started at', listener.address().port))
