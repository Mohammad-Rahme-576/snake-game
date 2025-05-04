// Game constants
const GRID_SIZE = 20;
const INITIAL_SNAKE_POSITION = { x: 10, y: 10 };
const INITIAL_SPEED = 200;
const MIN_SPEED = 50;
const SPEED_DECREASE_PER_LEVEL = 10;
const POINTS_PER_FOOD = 10;
const POINTS_FOR_SPECIAL_FOOD = 30;
const SPECIAL_FOOD_CHANCE = 0.2;
const POINTS_PER_LEVEL = 50;

// Game state
let snake = [INITIAL_SNAKE_POSITION];
let direction = { x: 0, y: 0 };
let nextDirection = { x: 0, y: 0 };
let food = null;
let specialFood = null;
let specialFoodTimer = null;
let score = 0;
let level = 1;
let gameInterval = null;
let gameTimer = null;
let gamePaused = false;
let gameTime = 0;
let selectedSpeed = INITIAL_SPEED;
let selectedTheme = 'classic';

// Initialize game
function initializeGame() {
    snake = [INITIAL_SNAKE_POSITION];
    direction = { x: 0, y: 0 };
    nextDirection = { x: 0, y: -1 };
    score = 0;
    level = 1;
    gameTime = 0;
    food = generateFoodPosition();
    specialFood = null;
    updateScore();
    updateLevel();
    updateTimer();
    drawGame();
}

// Helper functions
function generateFoodPosition() {
    const position = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
    };
    
    return snake.some(segment => segment.x === position.x && segment.y === position.y)
        ? generateFoodPosition()
        : position;
}

function tryGenerateSpecialFood() {
    if (!specialFood && Math.random() < SPECIAL_FOOD_CHANCE) {
        specialFood = generateFoodPosition();
        if (specialFoodTimer) clearTimeout(specialFoodTimer);
        specialFoodTimer = setTimeout(() => {
            specialFood = null;
            drawGame();
        }, 5000);
    }
}

function updateScore() {
    document.querySelector('#score span').textContent = score;
}

function updateLevel() {
    document.querySelector('#level span').textContent = level;
}

function updateTimer() {
    const minutes = Math.floor(gameTime / 60);
    const seconds = gameTime % 60;
    document.querySelector('#timer span').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function calculateGameSpeed() {
    const speedDecrease = (level - 1) * SPEED_DECREASE_PER_LEVEL;
    return Math.max(selectedSpeed - speedDecrease, MIN_SPEED);
}

function addSegment({ x, y }, className) {
    const segment = document.createElement('div');
    segment.style.gridColumnStart = x + 1;
    segment.style.gridRowStart = y + 1;
    segment.classList.add(className);
    return segment;
}

function drawGame() {
    const gameContainer = document.querySelector('#game-container');
    gameContainer.innerHTML = '';
    
    // Draw snake
    snake.forEach((segment, index) => {
        const element = addSegment(segment, 'snake');
        if (index === 0) {
            element.classList.add('snake-head');
        }
        gameContainer.appendChild(element);
    });
    
    // Draw regular food
    if (food) {
        gameContainer.appendChild(addSegment(food, 'food'));
    }
    
    // Draw special food
    if (specialFood) {
        gameContainer.appendChild(addSegment(specialFood, 'special-food'));
    }
}

function moveSnake() {
    if (gamePaused) return;

    // Update direction from next direction
    direction = { ...nextDirection };
    
    const head = { 
        x: snake[0].x + direction.x, 
        y: snake[0].y + direction.y 
    };

    // Check for collisions with walls
    if (head.x < 0 || head.x >= GRID_SIZE || 
        head.y < 0 || head.y >= GRID_SIZE) {
        gameOver();
        return;
    }

    // Check for collision with self
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // Check for food collision
    let ate = false;
    if (head.x === food.x && head.y === food.y) {
        score += POINTS_PER_FOOD;
        food = generateFoodPosition();
        tryGenerateSpecialFood();
        ate = true;
    } else if (specialFood && head.x === specialFood.x && head.y === specialFood.y) {
        score += POINTS_FOR_SPECIAL_FOOD;
        specialFood = null;
        if (specialFoodTimer) {
            clearTimeout(specialFoodTimer);
            specialFoodTimer = null;
        }
        ate = true;
    }

    // Remove tail if no food was eaten
    if (!ate) {
        snake.pop();
    }

    // Check for level up
    if (score >= level * POINTS_PER_LEVEL) {
        levelUp();
    }

    updateScore();
    drawGame();
}

function levelUp() {
    level++;
    updateLevel();
    
    // Update game speed
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = setInterval(moveSnake, calculateGameSpeed());
    }
    
    // Show level up message
    const levelUpMsg = document.createElement('div');
    levelUpMsg.textContent = `Level ${level}!`;
    levelUpMsg.className = 'level-up-message';
    document.querySelector('.game-wrapper').appendChild(levelUpMsg);
    setTimeout(() => levelUpMsg.remove(), 2000);
}

// function gameOver() {
//     clearInterval(gameInterval);
//     clearInterval(gameTimer);
//     gameInterval = null;
    
//     const highScore = localStorage.getItem('snakeHighScore') || 0;
//     if (score > highScore) {
//         localStorage.setItem('snakeHighScore', score);
//     } 

//     document.getElementById('final-score').textContent = score;
//     document.getElementById('high-score').textContent = Math.max(highScore, score);
//     document.getElementById('time-played').textContent = 
//         `${Math.floor(gameTime / 60)}:${(gameTime % 60).toString().padStart(2, '0')}`;
//     document.getElementById('final-level').textContent = level;
    
//     // Check for achievements
//     const achievementDisplay = document.getElementById('achievement-display');
//     achievementDisplay.innerHTML = '';
//     if (score > 100) achievementDisplay.innerHTML += '<div>🏆 Score Master!</div>';
//     if (level > 5) achievementDisplay.innerHTML += '<div>⭐ Level Expert!</div>';
//     if (gameTime > 300) achievementDisplay.innerHTML += '<div>⏰ Time Warrior!</div>';
    
//     document.getElementById('game-over-screen').style.display = 'flex';
// }


function gameOver() {
    clearInterval(gameInterval);
    clearInterval(gameTimer);
    gameInterval = null;
    
    const highScore = localStorage.getItem('snakeHighScore') || 0;
    if (score > highScore) {
        localStorage.setItem('snakeHighScore', score);
    } 

    document.getElementById('final-score').textContent = score;
    document.getElementById('high-score').textContent = Math.max(highScore, score);
    document.getElementById('time-played').textContent = 
        `${Math.floor(gameTime / 60)}:${(gameTime % 60).toString().padStart(2, '0')}`;
    document.getElementById('final-level').textContent = level;
    
    // Check for achievements
    const achievementDisplay = document.getElementById('achievement-display');
    achievementDisplay.innerHTML = '';
    if (score > 100) achievementDisplay.innerHTML += '<div>🏆 Score Master!</div>';
    if (level > 5) achievementDisplay.innerHTML += '<div>⭐ Level Expert!</div>';
    if (gameTime > 300) achievementDisplay.innerHTML += '<div>⏰ Time Warrior!</div>';
    
    // Add opacity and visibility
    document.getElementById('game-over-screen').style.opacity = '1';
    document.getElementById('game-over-screen').style.visibility = 'visible';
    document.getElementById('game-over-screen').style.display = 'flex';
}

function togglePause() {
    gamePaused = !gamePaused;
    const pauseScreen = document.getElementById('pause-screen');
    pauseScreen.style.display = gamePaused ? 'flex' : 'none';
}

function startGame() {
    if (gameInterval) return;
    
    document.querySelector('#start-screen').style.display = 'none';
    initializeGame();
    
    gameInterval = setInterval(moveSnake, calculateGameSpeed());
    gameTimer = setInterval(() => {
        if (!gamePaused) {
            gameTime++;
            updateTimer();
        }
    }, 1000);
}

// Event Listeners
document.addEventListener('keydown', e => {
    if (e.key.startsWith('Arrow')) {
        e.preventDefault();
        
        // Only process input if game is running and not paused
        if (!gameInterval || gamePaused) return;

        const newDirection = (() => {
            switch (e.key) {
                case 'ArrowUp': return direction.y !== 1 ? { x: 0, y: -1 } : null;
                case 'ArrowDown': return direction.y !== -1 ? { x: 0, y: 1 } : null;
                case 'ArrowLeft': return direction.x !== 1 ? { x: -1, y: 0 } : null;
                case 'ArrowRight': return direction.x !== -1 ? { x: 1, y: 0 } : null;
                default: return null;
            }
        })();

        if (newDirection) {
            nextDirection = newDirection;
        }
    } else if (e.key === ' ') {
        e.preventDefault();
        if (gameInterval) togglePause();
    }
});

// Theme selection
document.querySelectorAll('.theme-button').forEach(button => {
    button.addEventListener('click', () => {
        selectedTheme = button.getAttribute('data-theme');
        document.body.setAttribute('data-theme', selectedTheme);
        document.querySelectorAll('.theme-button').forEach(btn => 
            btn.classList.toggle('selected', btn === button));
    });
});

// Speed/mode selection
document.querySelectorAll('.mode-button').forEach(button => {
    button.addEventListener('click', () => {
        selectedSpeed = parseInt(button.getAttribute('data-speed'));
        document.querySelectorAll('.mode-button').forEach(btn => 
            btn.classList.toggle('selected', btn === button));
    });
});

// UI Button event listeners
document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('restart-game').addEventListener('click', () => {
    document.getElementById('game-over-screen').style.display = 'none';
    startGame();
});
document.getElementById('back-to-menu').addEventListener('click', () => {
    document.getElementById('game-over-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
});
document.getElementById('pause-button').addEventListener('click', togglePause);
document.getElementById('resume-game').addEventListener('click', togglePause);


// document.getElementById('reset-button').addEventListener('click', () => {
//     if (gameInterval) {
//         clearInterval(gameInterval);
//         clearInterval(gameTimer);
//     }
//     startGame();
// });
document.getElementById('reset-button').addEventListener('click', () => {
    // Stop any existing game intervals
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null;
    }
    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }

    // Hide any open screens
    document.getElementById('game-over-screen').style.display = 'none';
    document.getElementById('pause-screen').style.display = 'none';

    // Reset game state variables
    gamePaused = false;
    
    // Start a new game
    startGame();
});

// Initialize theme
document.body.setAttribute('data-theme', selectedTheme);

