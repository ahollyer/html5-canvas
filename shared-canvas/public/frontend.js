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
canvas.width = window.innerWidth * 0.8
canvas.height = window.innerHeight * 0.6
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

/********* Draw Function - Smoothed Curves **********/
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

/******** Accept Mouse Input, Transmit To/From Server **********/
function begin_draw(event) {
  mouse_down = true
}
function end_draw(event) {
  mouse_down = false
  draw_settings.past = null
}
function transmit_draw(event) {
  if(mouse_down) {
    draw_settings.current = [event.offsetX, event.offsetY]
    if(draw_settings.past) {
      draw(draw_settings)
    }
    socket.emit('draw', draw_settings)
    draw_settings.past = [event.offsetX, event.offsetY]
  }
}
socket.on('draw', function(draw_settings) {
  if(draw_settings.past) {
    draw(draw_settings)
  }
})

canvas.addEventListener('mousedown', begin_draw)
canvas.addEventListener('mouseup', end_draw)
canvas.addEventListener('mousemove', transmit_draw)

/****** Mobile/Touch Support - Emulate Mouse Events *****/
canvas.addEventListener("touchstart", function (event) {
  let touch = event.touches[0];
  let mouseEvent = new MouseEvent("mousedown", {
    clientX: touch.clientX,
    clientY: touch.clientY
  })
  canvas.dispatchEvent(mouseEvent)
})
canvas.addEventListener("touchend", function (event) {
  let mouseEvent = new MouseEvent("mouseup", {})
  canvas.dispatchEvent(mouseEvent)
})
canvas.addEventListener("touchmove", function (event) {
  let touch = event.touches[0]
  let mouseEvent = new MouseEvent("mousemove", {
    clientX: touch.clientX,
    clientY: touch.clientY
  })
  canvas.dispatchEvent(mouseEvent)
})

/********* Prevent scrolling for touch events ********/
function prevent_scroll(event) {
  if(event.target === canvas) {
    event.preventDefault()
  }
}
canvas.addEventListener('touchstart', prevent_scroll)
canvas.addEventListener('touchend', prevent_scroll)
canvas.addEventListener('touchmove', prevent_scroll)
