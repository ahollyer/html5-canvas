const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.use(express.static('public'))

http.listen('8000', function() {
  console.log('Listening on port 8000')
})
