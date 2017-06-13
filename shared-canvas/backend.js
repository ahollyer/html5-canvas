const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.use(express.static('public'))

app.get('/', function(req, resp) {
  resp.send('index.html')
})

io.on('connection', function(client) {
  console.log('Connected!')

  client.on('disconnect', function() {
    console.log('Exited!')
  })

  client.on('draw', function(past, current, color, drawtool) {
    io.emit('draw', past, current, color, drawtool)
  })
})

http.listen('8000', function() {
  console.log('Listening on port 8000')
})
