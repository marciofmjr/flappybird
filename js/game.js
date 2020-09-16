const sprites = new Image()
sprites.src = './img/sprites.png'

function getBrowserSize() {
  return {
    width: Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    ),
    height: Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.documentElement.clientHeight
    )
  }
}

const canvas = document.querySelector('canvas')
// const browser = getBrowserSize()
// canvas.width = browser.width
// canvas.height = browser.height
const context = canvas.getContext('2d')

const background = {
  spriteX: 390,
  spriteY: 0,
  width: 275,
  height: 204,
  x: 0,
  y: canvas.height - 204,
  draw() {
    context.fillStyle = '#70c5ce'
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.drawImage(
      sprites,
      background.spriteX, background.spriteY, // x, y position in sprite
      background.width, background.height, // size in sprite
      background.x, background.y, // x, y in screen
      background.width, background.height // size in screen
    )
    context.drawImage(
      sprites,
      background.spriteX, background.spriteY, // x, y position in sprite
      background.width, background.height, // size in sprite
      (background.x + background.width), background.y, // x, y in screen
      background.width, background.height // size in screen
    )
  }
}

const floor = {
  spriteX: 0,
  spriteY: 610,
  width: 224,
  height: 112,
  x: 0,
  y: canvas.height - 112,
  draw() {
    context.drawImage(
      sprites,
      floor.spriteX, floor.spriteY, // x, y position in sprite
      floor.width, floor.height, // size in sprite
      floor.x, floor.y, // x, y in screen
      floor.width, floor.height // size in screen
    )
    context.drawImage(
      sprites,
      floor.spriteX, floor.spriteY, // x, y position in sprite
      floor.width, floor.height, // size in sprite
      (floor.x + floor.width), floor.y, // x, y in screen
      floor.width, floor.height // size in screen
    )
  }
}

const bird = {
  spriteX: 0,
  spriteY: 0,
  width: 33,
  height: 24,
  x: 10,
  y: 50,
  speed: 0,
  gravity: 0.25,
  update() {
    bird.speed = bird.speed + bird.gravity
    bird.y = bird.y + bird.speed
  },
  draw() {
    context.drawImage(
      sprites,
      bird.spriteX, bird.spriteY, // x, y position in sprite
      bird.width, bird.height, // size in sprite
      bird.x, bird.y, // x, y in screen
      bird.width, bird.height // size in screen
    )
  }
}

function loop() {
  background.draw()
  floor.draw()

  bird.draw()
  bird.update()

  requestAnimationFrame(loop)
}

loop()