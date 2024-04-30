let nbrCols = 4;
let nbrLines = 3;
let flippedCards = 0;
let firstCard, secondCard, yFirstCard, xFirstCard;
let score = 0;
let board;

const deck = "/ressources/memory-legume";

const $canvas = document.getElementById("myCanvas");
const ctx = $canvas.getContext("2d");

const $score = document.querySelector('.score')
console.log($score.textContent);
const width = $canvas.width;
const height = $canvas.height;
const dimSquare = Math.floor(Math.min(width / nbrCols, height / nbrLines));

board = initBoard(nbrLines, nbrCols);
board = shuffle(board, deck);
drawBoard(board);

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
  if (board[y][x][1] == 0) {
    board[y][x][1] = 1;
    flipCard(y, x);
    flippedCards++;
    if (flippedCards % 2 == 0) {
      score++;
      $score.textContent = score
      secondCard = board[y][x][0];
      pair = checkPair(firstCard, secondCard);
    } else {
      firstCard = board[y][x][0];
      xFirstCard = x;
      yFirstCard = y;
    }
  }
  if (!pair && flippedCards % 2 == 0) {
    flippedCards -= 2;
    board[y][x][1] = 0;
    board[yFirstCard][xFirstCard][1] = 0;
    setTimeout(() => {
      flipBackCard(y, x);
      flipBackCard(yFirstCard, xFirstCard);
    }, 500);
  }
  if (flippedCards == nbrCols * nbrLines) {
    ctx.font = "bold 72px Arial";
    ctx.fillStyle = "purple";
    setTimeout(() => {
      ctx.fillText("Bravo !", 200, 150)
      ctx.fillText(`Vous avez gagné en ${score} coups`, 5, 300, 590);
    }, 500);
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
          // board[line][col][0] = `${deck}/${i}.svg`;
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
      ctx.fillRect(
        j * dimSquare + 3,
        i * dimSquare + 3,
        dimSquare - 6,
        dimSquare - 6
      );
      const image = new Image();
      image.addEventListener("load", () => {
        ctx.drawImage(
          image,
          j * dimSquare + 15,
          i * dimSquare + 15,
          dimSquare - 30,
          dimSquare - 30
        );
      });
      image.src = "/ressources/question.svg";
    }
  }
}

function flipCard(i, j) {
  ctx.fillStyle = "white";
  ctx.fillRect(
    j * dimSquare + 3,
    i * dimSquare + 3,
    dimSquare - 6,
    dimSquare - 6
  );
  const image = new Image();
  image.addEventListener("load", () => {
    ctx.drawImage(
      image,
      j * dimSquare + 15,
      i * dimSquare + 15,
      dimSquare - 30,
      dimSquare - 30
    );
  });
  image.src = `${deck}/${board[i][j][0]}.svg`;
}

function flipBackCard(i, j) {
  ctx.fillStyle = "white";
  ctx.fillRect(
    j * dimSquare + 3,
    i * dimSquare + 3,
    dimSquare - 6,
    dimSquare - 6
  );
  const image = new Image();
  image.addEventListener("load", () => {
    ctx.drawImage(
      image,
      j * dimSquare + 15,
      i * dimSquare + 15,
      dimSquare - 30,
      dimSquare - 30
    );
  });
  image.src = "/ressources/question.svg";
}

function checkPair(firstCard, secondCard) {
  if (firstCard == secondCard) {
    return true;
  } else {
    return false;
  }
}
