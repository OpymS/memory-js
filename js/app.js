import { getPresentUser, updateUser, getBestScores, updateScores } from "./storage.js";

const NBR_FRAMES = 6
const INTERVAL = 5

const user = getPresentUser("presentUser")[0] || { size: 12, puzzle: "memory-legume" }

let nbrCols;
let nbrLines;

let flippedCards = 0;
let tmpFlippedCards = 0;
let firstCard, secondCard, yFirstCard, xFirstCard;
let score = 0;
let board;
let cardsBack = new Image();
cardsBack.src = "/ressources/question.svg";
const deck = `/ressources/${user.puzzle}`;
const $canvas = document.getElementById("myCanvas");
const ctx = $canvas.getContext("2d");

const $score = document.querySelector('.score')
const width = $canvas.width;
const height = $canvas.height;
boardSize()

const dimSquare = Math.floor(Math.min(width / nbrCols, height / nbrLines));
const horizDecalage = (width - dimSquare * nbrCols) / 2

displayScores()
board = initBoard(nbrLines, nbrCols);
board = shuffle(board, deck);

cardsBack.addEventListener("load", () => {
  drawBoard(board);
})

document.addEventListener('keydown', (event) => {
  if (event.code == 'Space') {
    flippedCards = 0;
    tmpFlippedCards = 0;
    score = 0;
    board = initBoard(nbrLines, nbrCols);
    board = shuffle(board);
    drawBoard(board);
    $score.textContent = score
  }
});

$canvas.addEventListener("mousedown", function (event) {
  const rect = this.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left - horizDecalage) / dimSquare);
  const y = Math.floor((event.clientY - rect.top) / dimSquare);
  let pair = false;
  if (tmpFlippedCards < 2 && board[y][x][1] == 0) {
    tmpFlippedCards++
    board[y][x][1] = 1;
    if (tmpFlippedCards == 1) {
      flippedCards++;
      flipCard(y, x);
      firstCard = board[y][x][0];
      xFirstCard = x;
      yFirstCard = y;
    } else if (tmpFlippedCards == 2) {
      flippedCards++;
      flipCard(y, x);
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
    winner()
    modifyBestScores()
    displayScores()
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

function shuffle(board) {
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
      ctx.fillRect(horizDecalage + j * dimSquare + 3, i * dimSquare + 3, dimSquare - 6, dimSquare - 6);
      ctx.drawImage(cardsBack, horizDecalage + j * dimSquare + 8, i * dimSquare + 8, dimSquare - 16, dimSquare - 16);
    }
  }
}

function flipCard(i, j) {
  const endImage = new Image();
  endImage.src = `${deck}/${board[i][j][0]}.svg`
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
    ctx.clearRect(horizDecalage + x * dimSquare - 3, y * dimSquare - 3, dimSquare + 6, dimSquare + 6);
    ctx.fillRect(horizDecalage + x * dimSquare + 3, y * dimSquare + 3, (dimSquare - 6), dimSquare - 6)
    ctx.drawImage(endImage, horizDecalage + x * dimSquare + 8, y * dimSquare + 8, (dimSquare - 16), dimSquare - 16);
  }, (NBR_FRAMES + 2) * INTERVAL);
  const interval = setInterval(() => {
    ctx.clearRect(horizDecalage + x * dimSquare - 3, y * dimSquare - 3, dimSquare + 6, dimSquare + 6);
    ctx.fillStyle = "white";
    if (i < NBR_FRAMES / 2) {
      const horizChange = (dimSquare - 6) * (i + 1) / NBR_FRAMES
      const vertChange = dimSquare / 3 * (i + 1) / NBR_FRAMES
      ctx.beginPath();
      ctx.moveTo(horizDecalage + x * dimSquare + 3 + horizChange, y * dimSquare + 3 + vertChange);
      ctx.lineTo(horizDecalage + (x + 1) * dimSquare - 3 - horizChange, y * dimSquare + 3 - vertChange);
      ctx.lineTo(horizDecalage + (x + 1) * dimSquare - 3 - horizChange, (y + 1) * dimSquare - 3 + vertChange);
      ctx.lineTo(horizDecalage + x * dimSquare + 3 + horizChange, (y + 1) * dimSquare - 3 - vertChange);
      ctx.lineTo(horizDecalage + x * dimSquare + 3 + horizChange, y * dimSquare + 3 + vertChange)
      ctx.fill();
    } else {
      const horizChange = (dimSquare - 6) * (NBR_FRAMES - i - 1) / NBR_FRAMES
      const vertChange = -(dimSquare / 3 * (NBR_FRAMES - i - 1) / NBR_FRAMES)
      ctx.beginPath();
      ctx.moveTo(horizDecalage + x * dimSquare + 3 + horizChange, y * dimSquare + 3 - vertChange);
      ctx.lineTo(horizDecalage + (x + 1) * dimSquare - 3 - horizChange, y * dimSquare + 3 + vertChange);
      ctx.lineTo(horizDecalage + (x + 1) * dimSquare - 3 - horizChange, (y + 1) * dimSquare - 3 - vertChange);
      ctx.lineTo(horizDecalage + x * dimSquare + 3 + horizChange, (y + 1) * dimSquare - 3 + vertChange);
      ctx.lineTo(horizDecalage + x * dimSquare + 3 + horizChange, y * dimSquare + 3 - vertChange)
      ctx.fill();
    }
    i++
    if (i >= NBR_FRAMES) {
      clearInterval(interval)
    }
  }, INTERVAL);
}

function winner() {
  ctx.font = "bold 72px Arial";
  const game = []
  game.push(score)
  game.push(`${nbrCols} x ${nbrLines}`)
  game.push(user.puzzle)
  game.push(Date.now())
  user.lastScores.unshift(game)
  if (user.lastScores.length > 10) {
    user.lastScores.length = 10
  }
  updateUser(user)
  setTimeout(() => {
    ctx.fillStyle = "purple";
    ctx.fillText("Bravo !", 200, 150)
    ctx.fillText(`Vous avez gagné en ${score} coups`, 5, 300, 590);
  }, (NBR_FRAMES + 1) * INTERVAL + 500);
}

function modifyBestScores() {
  const bestScores = getBestScores()
  const newScore = []
  newScore.push(user.name)
  newScore.push(score)
  newScore.push(`${nbrCols} x ${nbrLines}`)
  newScore.push(user.puzzle)
  newScore.push(Date.now())
  if (bestScores.length == 0) {
    bestScores.push(newScore)
    updateScores(bestScores)
  } else {
    for (let i = 0; i < bestScores.length; i++) {
      if (score <= bestScores[i][1]) {
        bestScores.splice(i, 0, newScore)
        if (bestScores.length > 5) {
          bestScores.length = 5
        }
        updateScores(bestScores)
        break;
      }
    }
  }

}

function displayScores() {
  const $table = document.getElementById('table')
  const bestScores = getBestScores()
  const $displayedScores = document.querySelector('tbody')
  if ($displayedScores != null) {
    $displayedScores.remove()
  }
  let tbody = document.createElement("tbody")
  bestScores.forEach(score => {
    const row = document.createElement("tr")
    for (let i = 0; i < 5; i++) {
      const cell = document.createElement("td")
      if (i == 4) {
        const date = new Date(score[i]);
        cell.textContent = date.toLocaleDateString()
      } else {
        cell.textContent = score[i]
      }
      row.appendChild(cell)
    }
    tbody.appendChild(row)
  });
  $table.appendChild(tbody)
}


function boardSize() {
  switch (user.size) {
    case 12:
      nbrCols = 4
      nbrLines = 3
      break;
    case 16:
      nbrCols = 4
      nbrLines = 4
      break;
    case 20:
      nbrCols = 5
      nbrLines = 4
      break;
    case 42:
      nbrCols = 7
      nbrLines = 6
      break;
    case 48:
      nbrCols = 8
      nbrLines = 6
      break;
    case 56:
      nbrCols = 8
      nbrLines = 7
      break;
    default:
      nbrCols = 4;
      nbrLines = 3;
      break;
  }
}