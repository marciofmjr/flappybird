const sprites = new Image()
sprites.src = './img/sprites.png'

const configs = {
  AUDIO: true,
  PIPES_SPACING: 90,
  PIPES_SPEED: 2,
  FLOOR_MOVIMENT: 1,
  HIT_GAP: 4
}

const sounds = {
  hit: new Audio
}

sounds.hit.src = './sounds/hit.wav'

function playSound(sound) {
  if (configs.AUDIO) {
    sound.play()
  }
}

let frames = 0

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

let bird = {}

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
let floor = {}
function initFloor() {
  return {
    spriteX: 0,
    spriteY: 610,
    width: 224,
    height: 112,
    x: 0,
    y: canvas.height - 112,
    update() {
      const floorMoviment = configs.FLOOR_MOVIMENT
      const repeteIn = floor.width / 2
      floor.x = (floor.x - floorMoviment) % repeteIn
    },
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
}

let pipes = {}
function initPipes() {
  return {
    up: {
      spriteX: 52,
      spriteY: 169,
    },
    down: {
      spriteX: 0,
      spriteY: 169,
    },
    space: configs.PIPES_SPACING,
    width: 52,
    height: 400,
    pairs: [],
    draw() {
      this.pairs.forEach(function (pair) {
        const randomY = -200
        upX = pair.x
        upY = pair.y
        context.drawImage(
          sprites,
          pipes.up.spriteX, pipes.up.spriteY, // x, y position in sprite
          pipes.width, pipes.height, // size in sprite
          upX, upY, // x, y in screen
          pipes.width, pipes.height // size in screen
        )

        downX = pair.x
        downY = pipes.height + pipes.space + pair.y
        context.drawImage(
          sprites,
          pipes.down.spriteX, pipes.down.spriteY, // x, y position in sprite
          pipes.width, pipes.height, // size in sprite
          downX, downY, // x, y in screen
          pipes.width, pipes.height // size in screen
        )

        pair.up = { x: upX, y: pipes.height + upY }
        pair.down = { x: downX, y: downY }
      })
    },
    birdHitPipe(pair) {
      const birdHead = bird.y
      const birdFoot = bird.y + bird.height

      if ((bird.x + (bird.width - configs.HIT_GAP )) >= pair.x) {
        if (birdHead <= pair.up.y || birdFoot >= pair.down.y) {
          playSound(sounds.hit)
          return true
        }
      }
      return false
    },
    update() {
      const pass100frames = frames % 100 === 0
      if (pass100frames) {
        this.pairs.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1),
        })
      }

      this.pairs.forEach(function (pair) {
        pair.x = pair.x - configs.PIPES_SPEED

        if (pipes.birdHitPipe(pair)) {
          goToScreen(screens.START)
        }

        if (pair.x + pipes.width <= 0) {
          pipes.pairs.shift()
        }
      })
    }
  }
}


function initBird() {
  return {
    spriteX: 0,
    spriteY: 0,
    width: 33,
    height: 24,
    x: 10,
    y: 50,
    speed: 0,
    gravity: 0.25,
    jumpWeight: 4.6,
    update() {
      if (birdHitFloor(bird, floor)) {
        playSound(sounds.hit)
        setTimeout(function () {
          goToScreen(screens.START)
        }, 500)
        return
      }
      bird.speed = bird.speed + bird.gravity
      bird.y = bird.y + bird.speed
    },
    animate: [
      { spriteX: 0, spriteY: 0 }, // wing up
      { spriteX: 0, spriteY: 26 }, // wing middle
      { spriteX: 0, spriteY: 52 }, // wing down
      { spriteX: 0, spriteY: 26 }, // wing middle
    ],
    animationIndex: 0,
    updateAnimationIndex() {
      const framesInterval = 8
      const passInterval = frames % framesInterval === 0
      if (passInterval) {
        const incrementBase = 1
        const increment = incrementBase + bird.animationIndex
        const animations = bird.animate.length
        bird.animationIndex = increment % animations
      }
    },
    draw() {
      bird.updateAnimationIndex()
      const { spriteX, spriteY } = bird.animate[bird.animationIndex]
      context.drawImage(
        sprites,
        spriteX, spriteY, // x, y position in sprite
        bird.width, bird.height, // size in sprite
        bird.x, bird.y, // x, y in screen
        bird.width, bird.height // size in screen
      )
    },
    jump() {
      bird.speed = - bird.jumpWeight
    }
  }
}

const getReadyMessage = {
  spriteX: 134,
  spriteY: 0,
  width: 174,
  height: 152,
  x: (canvas.width / 2) - (175 / 2),
  y: 50,
  draw() {
    context.drawImage(
      sprites,
      getReadyMessage.spriteX, getReadyMessage.spriteY, // x, y position in sprite
      getReadyMessage.width, getReadyMessage.height, // size in sprite
      getReadyMessage.x, getReadyMessage.y, // x, y in screen
      getReadyMessage.width, getReadyMessage.height // size in screen
    )
  }
}

function birdHitFloor(bird, floor) {
  return (bird.y + bird.height) >= floor.y
}

let activeScreen = {}
function goToScreen(newScreen) {
  activeScreen = newScreen

  if (activeScreen.init) {
    activeScreen.init()
  }
}

const screens = {}
screens.START = {
  init() {
    bird = initBird()
    floor = initFloor()
  },
  draw() {
    background.draw()
    floor.draw()
    bird.draw()

    getReadyMessage.draw()
  },
  click() {
    goToScreen(screens.GAME)
  },
  update() {
    floor.update()
  }
}
screens.GAME = {
  init() {
    pipes = initPipes()
  },
  draw() {
    background.draw()
    pipes.draw()
    floor.draw()

    bird.draw()
    bird.update()
  },
  click() {
    bird.jump()
  },
  update() {
    floor.update()
    pipes.update()
  }
}

function loop() {
  activeScreen.draw()
  activeScreen.update()

  frames++
  requestAnimationFrame(loop)
}

window.addEventListener('click', function () {
  if (activeScreen.click) {
    activeScreen.click()
  }
})

goToScreen(screens.START)
loop()