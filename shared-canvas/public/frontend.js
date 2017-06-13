const socket = io()

/********* Chalkboard Variables ************/
let draw_settings = {
  past: null,
  current: null,
  color: 'rgb(250, 100, 150)',
  draw_tool: 3
}
let mouse_down = false
let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')

/************* Color Palette ****************/
let palette = {
  red: document.getElementById("red"),
  orange: document.getElementById("orange"),
  yellow: document.getElementById("yellow"),
  green: document.getElementById("green"),
  turquoise: document.getElementById("turquoise"),
  purple: document.getElementById("purple"),
  pink: document.getElementById("pink"),
  white: document.getElementById("white"),
}

palette.red.addEventListener('click', function() {
  draw_settings.color = '#F34336'
})
palette.orange.addEventListener('click', function() {
  draw_settings.color = '#FE5722'
})
palette.yellow.addEventListener('click', function() {
  draw_settings.color = 'yellow'
})
palette.green.addEventListener('click', function() {
  draw_settings.color = '#8BC24A'
})
palette.turquoise.addEventListener('click', function() {
  draw_settings.color = 'turquoise'
})
palette.purple.addEventListener('click', function() {
  draw_settings.color = '#7C4DFE'
})
palette.pink.addEventListener('click', function() {
  draw_settings.color = 'rgb(250, 100, 150)'
})
palette.white.addEventListener('click', function() {
  draw_settings.color = 'white'
})

/**************** Drawing Tools ***************/
let thin = document.getElementById("thin")
let thick = document.getElementById("thick")
let eraser = document.getElementById("eraser")

thin.addEventListener('click', function() {
  if(draw_settings.color === '#333') {
    draw_settings.color = 'rgb(250, 100, 150)'
  }
  draw_settings.draw_tool = 3
})
thick.addEventListener('click', function() {
  if(draw_settings.color === '#333') {
    draw_settings.color = 'rgb(250, 100, 150)'
  }

  draw_settings.draw_tool = 20
})
eraser.addEventListener('click', function() {
  draw_settings.color = '#333'
  draw_settings.draw_tool = 20
})

/********* Draw Smoothed Curves **********/
function draw(draw_settings) {
  ctx.beginPath()
  ctx.lineWidth = draw_settings.draw_tool
  ctx.strokeStyle = draw_settings.color
  ctx.moveTo(draw_settings.past[0], draw_settings.past[1])
  ctx.quadraticCurveTo(
    draw_settings.past[0], draw_settings.past[1],
    draw_settings.current[0], draw_settings.current[1]
  )
  ctx.stroke()
  ctx.closePath()
}

/********* Accept Mouse Input ****************/
canvas.addEventListener('mousedown', function(event) {
  mouse_down = true
  // console.log('down', event.offsetX, event.offsetY)
})
canvas.addEventListener('mouseup', function(event) {
  mouse_down = false
  draw_settings.past = null
  // console.log('up', event.offsetX, event.offsetY)
})
canvas.addEventListener('mousemove', function(event) {
  if(mouse_down) {
    draw_settings.current = [event.offsetX, event.offsetY]
    // console.log('move', event.offsetX, event.offsetY)
    if(draw_settings.past) {
      draw(draw_settings)
    }
    socket.emit('draw', draw_settings)
    draw_settings.past = [event.offsetX, event.offsetY]
  }
})
socket.on('draw', function(draw_settings) {
  if(draw_settings.past) {
    draw(draw_settings)
  }
})
