const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.use(express.static('public'))

app.get('/', function(req, resp) {
  resp.send('index.html')
})

io.on('connection', function(client) {
  client.on('draw', function(draw_settings) {
    io.emit('draw', draw_settings)
  })
})

http.listen('8001')
