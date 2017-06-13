const socket = io()

// Chalkboard functionality
let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')

// To draw smoothed curves
function draw(past, current, color, drawtool) {
  ctx.beginPath()
  ctx.lineWidth = drawtool
  ctx.strokeStyle = color
  ctx.moveTo(past[0], past[1])
  ctx.quadraticCurveTo(
    past[0], past[1],
    current[0], current[1]
  )
  ctx.stroke()
  ctx.closePath()
}

// Catch mouse events
let past = null
let current = null
let color = 'rgb(250, 100, 150)'
let drawtool = 3

let mouse_down = false

// ctx.beginPath()
canvas.addEventListener('mousedown', function(event) {
  mouse_down = true
  // console.log('down', event.offsetX, event.offsetY)
})
canvas.addEventListener('mouseup', function(event) {
  mouse_down = false
  past = null
  // console.log('up', event.offsetX, event.offsetY)
})
canvas.addEventListener('mousemove', function(event) {
  if(mouse_down) {
    current = [event.offsetX, event.offsetY]
    // console.log('move', event.offsetX, event.offsetY)
    if(past) {
      draw(past, current, color, drawtool)
    }
    socket.emit('draw', past, current, color, drawtool)
    past = [event.offsetX, event.offsetY]
  }
})

socket.on('draw', function(past, current, color, drawtool) {
  if(past) {
    draw(past, current, color, drawtool)
  }
})

// Allow user to change colors
const pink = document.getElementById("pink")
const purple = document.getElementById("purple")
const turquoise = document.getElementById("turquoise")
const yellow = document.getElementById("yellow")
const orange = document.getElementById("orange")
const white = document.getElementById("white")
const eraser = document.getElementById("eraser")

pink.addEventListener('click', function() {
  color = 'rgb(250, 100, 150)'
})
purple.addEventListener('click', function() {
  color = '#9B27AF'
})
turquoise.addEventListener('click', function() {
  color = 'turquoise'
})
yellow.addEventListener('click', function() {
  color = 'yellow'
})
orange.addEventListener('click', function() {
  color = '#FE5722'
})
white.addEventListener('click', function() {
  color = 'white'
})
eraser.addEventListener('click', function() {
  color = '#333'
  drawtool = 20
})

// Allow user to select line thickness
const thin = document.getElementById("thin")
const thick = document.getElementById("thick")

thin.addEventListener('click', function() {
  drawtool = 3
})

thick.addEventListener('click', function() {
  drawtool = 20
})
