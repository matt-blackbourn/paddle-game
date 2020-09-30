//canvas setup
let canvas = document.querySelector("#myCanvas")
let ctx = canvas.getContext("2d")

//paddle setup
let paddleWidth = 75
let paddleHeight = 10
let paddleX = canvas.width/2 - paddleWidth/2
let paddleY = canvas.height - paddleHeight

//ball setup
let ballRadius = 10
let x = canvas.width/2
let y = canvas.height-20
let dx = 2
let dy = -2

//bricks setup
let brickRowCount = 8
let brickColCount = 11
let brickWidth = 35
let brickHeight = 15
let brickGap = 5
let leftOffset = 20
let topOffset = 20

//build bricks 2D array
let bricks = []
for(let r = 0; r < brickRowCount; r++){
   bricks[r] = []
   for(let c = 0; c < brickColCount; c++){
      bricks[r][c] = {x: 0, y: 0, status: 3}
   }
}

let leftPressed = false
let rightPressed = false
let gamePaused = false
let score = 0
let lives = 3

document.addEventListener("keydown", keyDownHandler, false)
document.addEventListener("keyup", keyUpHandler, false)

let interval = setInterval(buildCanvas, 10)

function buildCanvas(){
   ctx.clearRect(0, 0, canvas.width, canvas.height)
   drawBricks()
   drawPaddle()
   drawBall()
   movePaddle()
   updateScore()
   updateLives()
   x += dx
   y += dy
   collisionDetect()
}

function keyDownHandler(e){
   if(e.keyCode === 37){
      leftPressed = true
   } else if(e.keyCode === 39){
      rightPressed = true
   }
}

function keyUpHandler(e){
   if(e.keyCode === 37){
      leftPressed = false
   } else if(e.keyCode === 39){
      rightPressed = false
   }
}

function drawBricks(){
   for(let r = 0; r < bricks.length; r++){
      for(let c = 0; c < bricks[r].length; c++){
         let b = bricks[r][c]
         if(b.status > 0){
            let brickX = leftOffset + c*(brickWidth + brickGap)
            let brickY = topOffset + r*(brickHeight + brickGap)
            b.x = brickX
            b.y = brickY
            ctx.beginPath()
            ctx.rect(brickX, brickY, brickWidth, brickHeight)
            switch(b.status){
               case 3: ctx.fillStyle = "green"
               break
               case 2: ctx.fillStyle = "orange"
               break
               case 1: ctx.fillStyle = "yellow"
               break
            }
            ctx.fill()
            ctx.closePath()
         }
      }
   }
}

function drawBall(){
   ctx.beginPath()
   ctx.arc(x, y, ballRadius, 0, Math.PI*2)
   ctx.fillStyle = "red"
   ctx.fill()
   ctx.closePath()
}  

function drawPaddle(){
   ctx.beginPath()
   ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight)
   ctx.fillStyle = "blue"
   ctx.fill()
   ctx.closePath()
}

function movePaddle(){
   if(rightPressed){
      paddleX += 7
      if(paddleX > canvas.width - paddleWidth){
         paddleX = canvas.width - paddleWidth
      }
   } 
   if(leftPressed){
      paddleX -= 7
      if(paddleX < 0){
         paddleX = 0
      }
   } 
}

function collisionDetect(){
   if(x > canvas.width - ballRadius || x < ballRadius) dx = -dx
   if(y < ballRadius){
      dy = -dy 
   } else if (y > paddleY - ballRadius){
      x > paddleX && x < paddleX + paddleWidth ? dy = -dy : lifeLost()
   }
   brickCollisions() 
}

function lifeLost(){
   lives --
   if(!lives){
      alert("No lives remaining! Play again?")
      document.location.reload()
      clearInterval(interval)
   } else {
      x = canvas.width/2
      y = canvas.height-20
      dx = 2
      dy = -2
      paddleX = canvas.width/2 - paddleWidth/2
   }
}

function brickCollisions(){
   for(let r = 0; r < bricks.length; r++){
      for(let c = 0; c < bricks[r].length; c++){
         let b = bricks[r][c]
         if(b.status > 0){
            if(x > b.x - ballRadius && x < b.x + ballRadius + brickWidth && y > b.y - ballRadius && y < b.y + brickHeight + ballRadius){
               b.status --
               if(b.status === 0) score ++
               dy = -dy
               if(score === brickColCount * brickRowCount){
                  alert("You Win! Play again?")
                  document.location.reload()
                  clearInterval(interval)
               }
            }   
         }
      }
   }
}

function updateScore(){
   ctx.font = "16px Arial"
   ctx.fillStyle = "black"
   ctx.fillText("Score: " + score, 20, 350)
}   

function updateLives(){
   ctx.font = "16px Arial"
   ctx.fillStyle = "black"
   ctx.fillText("Lives left: " + lives, 20, 370)
}

function pause(){
   if(!gamePaused){
      clearInterval(interval)
      gamePaused = true
   } else {
      interval = setInterval(buildCanvas, 10)
      gamePaused = false
   }
}




