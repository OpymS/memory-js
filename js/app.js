const NBR_FRAMES = 6
const INTERVAL = 5

let nbrCols = 4;
let nbrLines = 3;
let flippedCards = 0;
let tmpFlippedCards = 0;
let firstCard, secondCard, yFirstCard, xFirstCard;
let score = 0;
let board;
let cardsBack = new Image();
cardsBack.src = "/ressources/question.svg";

const deck = "/ressources/memory-legume";

const $canvas = document.getElementById("myCanvas");
const ctx = $canvas.getContext("2d");

const $score = document.querySelector('.score')
const width = $canvas.width;
const height = $canvas.height;
const dimSquare = Math.floor(Math.min(width / nbrCols, height / nbrLines));

board = initBoard(nbrLines, nbrCols);
board = shuffle(board, deck);

cardsBack.addEventListener("load", () => {
  drawBoard(board);
})

document.addEventListener('keydown', (event) => {
  if (event.code == 'Space') {
    flippedCards = 0;
    score = 0;
    board = initBoard(nbrLines, nbrCols);
    board = shuffle(board, deck);
    drawBoard(board);
    $score.textContent = score
  }
});

$canvas.addEventListener("mousedown", function (event) {
  const rect = this.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) / dimSquare);
  const y = Math.floor((event.clientY - rect.top) / dimSquare);
  let pair = false;
  if (tmpFlippedCards < 2 && board[y][x][1] == 0) {
    tmpFlippedCards++
    board[y][x][1] = 1;
    flipCard(y, x);
    flippedCards++;
    if (flippedCards % 2 == 1) {
      firstCard = board[y][x][0];
      xFirstCard = x;
      yFirstCard = y;
    } else {
      score++;
      $score.textContent = score
      secondCard = board[y][x][0];
      pair = checkPair(firstCard, secondCard);
    }
  }
  if (flippedCards % 2 == 0) {
    if (pair) {
      setTimeout(() => {
        tmpFlippedCards = 0
      }, (NBR_FRAMES + 1) * INTERVAL + 500);
    } else {
      flippedCards -= 2;
      board[y][x][1] = 0;
      board[yFirstCard][xFirstCard][1] = 0;
      setTimeout(() => {
        flipBackCard(y, x);
        flipBackCard(yFirstCard, xFirstCard);
        tmpFlippedCards = 0
      }, (NBR_FRAMES + 1) * INTERVAL + 500);
    }

  }
  if (flippedCards == nbrCols * nbrLines) {
    ctx.font = "bold 72px Arial";
    setTimeout(() => {
      ctx.fillStyle = "purple";
      ctx.fillText("Bravo !", 200, 150)
      ctx.fillText(`Vous avez gagné en ${score} coups`, 5, 300, 590);
    }, (NBR_FRAMES + 1) * INTERVAL + 500);
  }

});

function initBoard(nbLines, nbCols) {
  const board = [];
  for (let i = 0; i < nbLines; i++) {
    board[i] = [];
    for (let j = 0; j < nbCols; j++) {
      board[i][j] = [0, -1];
    }
  }
  return board;
}

function shuffle(board, deck) {
  const nbLines = board.length;
  const nbCols = board[0].length;
  const nbrBox = nbLines * nbCols;
  for (let i = 1; i <= nbrBox / 2; i++) {
    for (let j = 0; j < 2; j++) {
      let isPut = false;
      do {
        const line = Math.floor(Math.random() * nbLines);
        const col = Math.floor(Math.random() * nbCols);
        if (board[line][col][1] == -1) {
          board[line][col][1] = 0;
          board[line][col][0] = i;
          isPut = true;
        }
      } while (!isPut);
    }
  }
  return board;
}

function drawBoard(board) {
  ctx.clearRect(0, 0, width, height);
  const nbLines = board.length;
  const nbCols = board[0].length;
  for (let i = 0; i < nbLines; i++) {
    for (let j = 0; j < nbCols; j++) {
      ctx.fillStyle = "white";
      ctx.fillRect(j * dimSquare + 3, i * dimSquare + 3, dimSquare - 6, dimSquare - 6);
      ctx.drawImage(cardsBack, j * dimSquare + 15, i * dimSquare + 15, dimSquare - 30, dimSquare - 30);
    }
  }
}

function flipCard(i, j) {
  const endImage = new Image();
  endImage.src = `${deck}/${board[i][j][0]}.svg`;
  endImage.addEventListener("load", () => {
    animateCard(i, j, endImage)
  });
}

function flipBackCard(i, j) {
  animateCard(i, j, cardsBack)
}

function checkPair(firstCard, secondCard) {
  if (firstCard == secondCard) {
    return true;
  } else {
    return false;
  }
}


function animateCard(y, x, endImage) {
  let i = 0
  setTimeout(() => {
    ctx.clearRect(x * dimSquare - 3, y * dimSquare - 3, dimSquare + 6, dimSquare + 6);
    ctx.fillRect((x * dimSquare + 3), y * dimSquare + 3, (dimSquare - 6), dimSquare - 6)
    ctx.drawImage(endImage, (x * dimSquare + 15), y * dimSquare + 15, (dimSquare - 30), dimSquare - 30);
  }, (NBR_FRAMES + 1) * INTERVAL);
  const interval = setInterval(() => {
    ctx.clearRect(x * dimSquare - 3, y * dimSquare - 3, dimSquare + 6, dimSquare + 6);
    ctx.fillStyle = "white";
    if (i < NBR_FRAMES / 2) {
      const horizDecalage = (dimSquare - 6) * (i + 1) / NBR_FRAMES
      const vertDecalage = dimSquare / 3 * (i + 1) / NBR_FRAMES
      ctx.beginPath();
      ctx.moveTo(x * dimSquare + 3 + horizDecalage, y * dimSquare + 3 + vertDecalage);
      ctx.lineTo((x + 1) * dimSquare - 3 - horizDecalage, y * dimSquare + 3 - vertDecalage);
      ctx.lineTo((x + 1) * dimSquare - 3 - horizDecalage, (y + 1) * dimSquare - 3 + vertDecalage);
      ctx.lineTo(x * dimSquare + 3 + horizDecalage, (y + 1) * dimSquare - 3 - vertDecalage);
      ctx.lineTo(x * dimSquare + 3 + horizDecalage, y * dimSquare + 3 + vertDecalage)
      ctx.fill();
    } else {
      const horizDecalage = (dimSquare - 6) * (NBR_FRAMES - i - 1) / NBR_FRAMES
      const vertDecalage = -(dimSquare / 3 * (NBR_FRAMES - i - 1) / NBR_FRAMES)
      ctx.beginPath();
      ctx.moveTo(x * dimSquare + 3 + horizDecalage, y * dimSquare + 3 - vertDecalage);
      ctx.lineTo((x + 1) * dimSquare - 3 - horizDecalage, y * dimSquare + 3 + vertDecalage);
      ctx.lineTo((x + 1) * dimSquare - 3 - horizDecalage, (y + 1) * dimSquare - 3 - vertDecalage);
      ctx.lineTo(x * dimSquare + 3 + horizDecalage, (y + 1) * dimSquare - 3 + vertDecalage);
      ctx.lineTo(x * dimSquare + 3 + horizDecalage, y * dimSquare + 3 - vertDecalage)
      ctx.fill();
    }
    i++
    if (i >= NBR_FRAMES) {
      clearInterval(interval)
    }
  }, INTERVAL);

}