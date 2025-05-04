// // Game state
// const GRID_SIZE = 20;
// const INITIAL_SNAKE_POSITION = { x: 10, y: 10 };

// let snake = [INITIAL_SNAKE_POSITION];
// let direction = { x: 0, y: 0 };
// let food = generateFoodPosition();
// let score = 0;
// let gameInterval = null;

// // Add game speed constants
// const INITIAL_SPEED = 200;
// const MIN_SPEED = 50;
// const SPEED_DECREASE_PER_POINT = 1;

// let selectedSpeed = INITIAL_SPEED;

// // Helper functions
// function generateFoodPosition() {
//     const position = {
//         x: Math.floor(Math.random() * GRID_SIZE),
//         y: Math.floor(Math.random() * GRID_SIZE)
//     };
    
//     // Ensure food doesn't spawn on snake
//     return snake.some(segment => segment.x === position.x && segment.y === position.y)
//         ? generateFoodPosition()  // Recursively try again
//         : position;
// }

// function addSegment({ x, y }, className) {
//     const segment = document.createElement('div');
//     segment.style.gridColumnStart = x + 1;
//     segment.style.gridRowStart = y + 1;
//     segment.classList.add(className);
    
//     // Add movement animation for new segments
//     if (className === 'snake') {
//         segment.classList.add('snake-segment-move');
//         setTimeout(() => {
//             segment.classList.remove('snake-segment-move');
//         }, 200);
//     }
    
//     return segment;
// }

// function updateScore() {
//     const currentSpeed = calculateGameSpeed();
//     document.querySelector('#score span').textContent = 
//         `${score} (Speed: ${Math.round(1000/currentSpeed)} moves/sec)`;
// }

// function drawGame() {
//     const gameContainer = document.querySelector('#game-container');
//     gameContainer.innerHTML = '';
    
//     // Draw snake
//     const snakeElements = snake.map(segment => addSegment(segment, 'snake'));
//     snakeElements.forEach(element => gameContainer.appendChild(element));
    
//     // Draw food
//     gameContainer.appendChild(addSegment(food, 'food'));
// }

// // Initialize game
// function initializeGame() {
//     snake = [INITIAL_SNAKE_POSITION];
//     direction = { x: 0, y: 0 };
//     food = generateFoodPosition();
//     score = 0;
//     updateScore();
//     drawGame();
// }

// function calculateGameSpeed() {
//     // Decrease interval time (increase speed) based on score
//     const newSpeed = INITIAL_SPEED - (score * SPEED_DECREASE_PER_POINT);
//     // Don't let speed go below minimum
//     return Math.max(newSpeed, MIN_SPEED);
// }

// function moveSnake() {
//     const head = { 
//         x: snake[0].x + direction.x, 
//         y: snake[0].y + direction.y 
//     };

//     // Check for collisions with walls
//     if (head.x < 0 || head.x >= GRID_SIZE || 
//         head.y < 0 || head.y >= GRID_SIZE) {
//         gameOver();
//         return;
//     }

//     // Check for collision with self
//     if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
//         gameOver();
//         return;
//     }

//     snake.unshift(head);

//     // Check if snake ate food
//     if (head.x === food.x && head.y === food.y) {
//         score += 10;
//         updateScore();
//         food = generateFoodPosition();
        
//         // Update game speed when food is eaten
//         if (gameInterval) {
//             clearInterval(gameInterval);
//             gameInterval = setInterval(moveSnake, calculateGameSpeed());
//         }
//     } else {
//         snake.pop();
//     }

//     drawGame();
// }

// function gameOver() {
//     clearInterval(gameInterval);
//     gameInterval = null;

//     const highScore = localStorage.getItem('snakeHighScore') || 0;
//     if (score > highScore) {
//         localStorage.setItem('snakeHighScore', score);
//     }

//     document.getElementById('final-score').textContent = score;
//     document.getElementById('high-score').textContent = Math.max(highScore, score);
//     document.getElementById('game-over-screen').style.display = 'flex';
// }

// // Restart or go to menu
// document.getElementById('restart-game').addEventListener('click', () => {
//     document.getElementById('game-over-screen').style.display = 'none';
//     startGame(selectedSpeed);
// });

// document.getElementById('back-to-menu').addEventListener('click', () => {
//     document.getElementById('game-over-screen').style.display = 'none';
//     document.getElementById('start-screen').style.display = 'flex';
// });

// // Handle mode selection
// document.querySelectorAll('.mode-button').forEach(button => {
//     button.addEventListener('click', () => {
//         selectedSpeed = parseInt(button.getAttribute('data-speed'));
//         document.querySelectorAll('.mode-button').forEach(btn => btn.classList.remove('selected'));
//         button.classList.add('selected');
//     });
// });

// // Start game
// document.querySelector('#start-game').addEventListener('click', () => {
//     console.log('Start Game button clicked');
//     document.querySelector('#start-screen').style.display = 'none';
//     startGame(selectedSpeed);
// });

// // Update startGame to accept speed
// function startGame(speed) {
//     if (gameInterval) return;
//     initializeGame();
//     gameInterval = setInterval(moveSnake, speed || INITIAL_SPEED);
// }

// // Adjust initialization
// initializeGame();
// document.querySelector('#start-screen').style.display = 'flex';
// //document.querySelector('#start-screen').classList.add('fade-out');


// // Update event listeners
// document.querySelector('#start-button').addEventListener('click', startGame);

// // Add keyboard controls
// document.addEventListener('keydown', e => {
//     // Prevent arrow keys from scrolling the page
//     if (e.key.startsWith('Arrow')) {
//         e.preventDefault();
//     }

//     // Only process input if game is running
//     if (!gameInterval) return;

//     switch (e.key) {
//         case 'ArrowUp':
//             if (direction.y !== 1) direction = { x: 0, y: -1 };
//             break;
//         case 'ArrowDown':
//             if (direction.y !== -1) direction = { x: 0, y: 1 };
//             break;
//         case 'ArrowLeft':
//             if (direction.x !== 1) direction = { x: -1, y: 0 };
//             break;
//         case 'ArrowRight':
//             if (direction.x !== -1) direction = { x: 1, y: 0 };
//             break;
//         case ' ': // Spacebar
//             if (gameInterval) {
//                 clearInterval(gameInterval);
//                 gameInterval = null;
//             } else {
//                 gameInterval = setInterval(moveSnake, 200);
//             }
//             break;
//     }
// });



import React, { useState, useEffect, useCallback } from 'react';

const SnakeGame = () => {
  // Game constants
  const GRID_SIZE = 20;
  const INITIAL_SNAKE_POSITION = { x: 10, y: 10 };
  const INITIAL_SPEED = 200;
  
  // Game state
  const [snake, setSnake] = useState([INITIAL_SNAKE_POSITION]);
  const [food, setFood] = useState(null);
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [nextDirection, setNextDirection] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameTime, setGameTime] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [selectedSpeed, setSelectedSpeed] = useState(INITIAL_SPEED);
  const [selectedTheme, setSelectedTheme] = useState('classic');

  // Generate food position
  const generateFoodPosition = useCallback(() => {
    const position = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    
    return snake.some(segment => segment.x === position.x && segment.y === position.y)
      ? generateFoodPosition()
      : position;
  }, [snake]);

  // Initialize game
  const initGame = useCallback(() => {
    setSnake([INITIAL_SNAKE_POSITION]);
    setDirection({ x: 0, y: 0 });
    setNextDirection({ x: 0, y: 0 });
    setScore(0);
    setLevel(1);
    setGameTime(0);
    setFood(generateFoodPosition());
    setIsGameOver(false);
    setIsPaused(false);
    setIsPlaying(true);
    setShowStartScreen(false);
  }, [generateFoodPosition]);

  // Handle game over
  const handleGameOver = useCallback(() => {
    setIsPlaying(false);
    setIsGameOver(true);
    const highScore = localStorage.getItem('snakeHighScore') || 0;
    if (score > highScore) {
      localStorage.setItem('snakeHighScore', score);
    }
  }, [score]);

  // Game loop
  useEffect(() => {
    if (!isPlaying || isPaused) return;

    const gameLoop = setInterval(() => {
      setSnake(prevSnake => {
        const head = { 
          x: prevSnake[0].x + nextDirection.x,
          y: prevSnake[0].y + nextDirection.y
        };

        // Check wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          handleGameOver();
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          handleGameOver();
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];
        
        // Check food collision
        if (food && head.x === food.x && head.y === food.y) {
          setScore(prev => prev + 10);
          setFood(generateFoodPosition());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });

      setDirection(nextDirection);
    }, selectedSpeed);

    return () => clearInterval(gameLoop);
  }, [isPlaying, isPaused, nextDirection, food, selectedSpeed, handleGameOver, generateFoodPosition]);

  // Timer
  useEffect(() => {
    if (isPlaying && !isPaused) {
      const timer = setInterval(() => {
        setGameTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPlaying, isPaused]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isPlaying) return;

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
        setNextDirection(newDirection);
      }

      if (e.key === ' ') {
        setIsPaused(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, direction]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      {showStartScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full">
            <h1 className="text-3xl font-bold text-center mb-6">Snake Game</h1>
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">How to Play</h2>
                <ul className="space-y-2">
                  <li>🎮 Use arrow keys to control the snake</li>
                  <li>🍎 Collect food to grow longer</li>
                  <li>⏸️ Press SPACE to pause</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Select Speed:</h3>
                <div className="flex gap-2">
                  {[
                    { name: 'Classic', speed: 200 },
                    { name: 'Fast', speed: 150 },
                    { name: 'Insane', speed: 100 }
                  ].map(mode => (
                    <button
                      key={mode.name}
                      onClick={() => setSelectedSpeed(mode.speed)}
                      className={`px-4 py-2 rounded ${
                        selectedSpeed === mode.speed
                          ? 'bg-blue-500'
                          : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    >
                      {mode.name}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={initGame}
                className="w-full py-3 bg-green-500 hover:bg-green-600 rounded-lg font-bold text-lg"
              >
                Start Game
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="game-container p-8 bg-gray-800 rounded-lg shadow-xl">
        <div className="flex justify-between mb-4 text-lg">
          <div>Score: {score}</div>
          <div>Level: {level}</div>
          <div>
            Time: {Math.floor(gameTime / 60)}:
            {(gameTime % 60).toString().padStart(2, '0')}
          </div>
        </div>

        <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{
          width: `${GRID_SIZE * 20}px`,
          height: `${GRID_SIZE * 20}px`
        }}>
          {snake.map((segment, index) => (
            <div
              key={index}
              className={`absolute w-5 h-5 rounded ${
                index === 0 ? 'bg-green-400' : 'bg-green-500'
              }`}
              style={{
                left: `${segment.x * 20}px`,
                top: `${segment.y * 20}px`,
                transition: 'all 0.1s'
              }}
            />
          ))}
          {food && (
            <div
              className="absolute w-5 h-5 bg-red-500 rounded-full"
              style={{
                left: `${food.x * 20}px`,
                top: `${food.y * 20}px`
              }}
            />
          )}
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => setIsPaused(prev => !prev)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={initGame}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded"
          >
            Reset
          </button>
        </div>
      </div>

      {isGameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg text-center">
            <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
            <p className="text-xl mb-2">Final Score: {score}</p>
            <p className="text-xl mb-4">
              High Score: {Math.max(score, localStorage.getItem('snakeHighScore') || 0)}
            </p>
            <div className="space-x-4">
              <button
                onClick={initGame}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded"
              >
                Play Again
              </button>
              <button
                onClick={() => {
                  setShowStartScreen(true);
                  setIsGameOver(false);
                }}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded"
              >
                Main Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;