const shapes = ["circle", "square", "triangle", "oval", "rectangle", "diamond"];
const gameArea = document.getElementById("game-area");
const startButton = document.getElementById("start-btn");
const message = document.getElementById("message");
const scoreDisplay = document.getElementById("score");
const gameOverPopup = document.getElementById("game-over-popup");
const playAgainButton = document.getElementById("play-again-btn");
const instructionsPopup = document.getElementById("instructions-popup");
const closeInstructionsBtn = document.getElementById("close-instructions-btn");

// Show the instructions popup on page load
window.addEventListener("load", () => {
  instructionsPopup.style.display = "flex";
});

// Close the instructions popup
closeInstructionsBtn.addEventListener("click", () => {
  instructionsPopup.style.display = "none";
});


let gameInterval, score = 0, gameOver = false;

function createShape() {
  if (gameOver) return;

  const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
  const shape = document.createElement("div");
  shape.classList.add("shape", shapeType);
  shape.draggable = true;

  // Position shape randomly
  shape.style.left = `${Math.random() * (gameArea.offsetWidth - 50)}px`;

  // Add event listeners
  shape.addEventListener("dragstart", dragStart);
  shape.addEventListener("dragend", dragEnd);

  gameArea.appendChild(shape);

  // Make the shape fall
  const fallInterval = setInterval(() => {
    const currentTop = parseInt(window.getComputedStyle(shape).top) || 0;
    if (currentTop >= gameArea.offsetHeight - 50) {
      clearInterval(fallInterval);
      shape.remove();
      adjustScore(-1); // Missed shape
    } else {
      shape.style.top = `${currentTop + 5}px`;
    }
  }, 100);
}

function dragStart(event) {
  if (gameOver) return;
  event.dataTransfer.setData("shapeType", event.target.classList[1]);
}

function dragEnd(event) {
  if (gameOver) return;
  event.target.remove();
}

function allowDrop(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  const shapeType = event.dataTransfer.getData("shapeType");
  const containerId = event.target.id;

  if (containerId.startsWith(shapeType)) {
    adjustScore(10); // Correct match
  } else {
    adjustScore(-5); // Mismatch
  }
}

function adjustScore(change) {
  score += change;
  scoreDisplay.textContent = score;

  if (score <= 0) {
    score = 0;
    endGame();
  }
}

function clearShapes() {
  const shapesOnScreen = document.querySelectorAll(".shape");
  shapesOnScreen.forEach(shape => shape.remove());
}

function startGame() {
  // Reset game state
  score = 0;
  scoreDisplay.textContent = score;
  message.textContent = "Match the shapes!";
  gameOverPopup.style.display = "none";
  startButton.style.display = "none";
  gameOver = false;

  // Clear all existing shapes
  clearShapes();

  // Start generating new shapes
  gameInterval = setInterval(createShape, 2000);
}

function endGame() {
  gameOver = true;
  clearInterval(gameInterval);

  // Disable dragging on existing shapes
  const shapesOnScreen = document.querySelectorAll(".shape");
  shapesOnScreen.forEach(shape => {
    shape.draggable = false;
  });

  gameOverPopup.style.display = "flex";
}

startButton.addEventListener("click", startGame);
playAgainButton.addEventListener("click", startGame);

const containers = document.querySelectorAll(".shape-container");
containers.forEach(container => {
  container.addEventListener("dragover", allowDrop);
  container.addEventListener("drop", drop);
});