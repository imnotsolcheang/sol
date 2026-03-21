// 貪食蛇遊戲 JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // 載入共用工具
    const Storage = window.GameTools?.Storage;
    const GameUtils = window.GameTools?.GameUtils;
    const Accessibility = window.GameTools?.Accessibility;
    
    // 遊戲變數
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.querySelector('.score-value');
    const highScoreElement = document.querySelector('.high-score-value');
    const difficultyElement = document.querySelector('.difficulty-value');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const restartBtn = document.getElementById('restart-btn');
    const gameOverScreen = document.getElementById('game-over');
    const finalScoreElement = document.getElementById('final-score');
    const finalHighScoreElement = document.getElementById('final-high-score');
    const newHighScoreElement = document.getElementById('new-high-score');
    const finalScoreValueElement = document.querySelector('.final-score-text .score-value');
    const finalHighScoreValueElement = document.querySelector('.final-high-score-text .high-score-value');
    
    // 開始畫面元素
    const startScreen = document.getElementById('start-screen');
    const gameTitle = document.getElementById('game-title');
    const startHint = document.getElementById('start-hint');
    
    // 難度按鈕
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    
    // 移動控制按鈕
    const upBtn = document.querySelector('.mobile-controls .up');
    const downBtn = document.querySelector('.mobile-controls .down');
    const leftBtn = document.querySelector('.mobile-controls .left');
    const rightBtn = document.querySelector('.mobile-controls .right');
    
    // 遊戲設定
    const gridSize = 20;
    const gridWidth = canvas.width / gridSize;
    const gridHeight = canvas.height / gridSize;
    
    // 難度設定
    const difficultySettings = {
        easy: {
            name: "簡單",
            initialSpeed: 200,
            speedIncrease: 3,
            scoreMultiplier: 1,
            color: "#2196F3",
            wallCollision: true,
            obstacles: 0
        },
        medium: {
            name: "中等",
            initialSpeed: 150,
            speedIncrease: 5,
            scoreMultiplier: 1,
            color: "#FF9800",
            wallCollision: true,
            obstacles: 3
        },
        hard: {
            name: "困難",
            initialSpeed: 100,
            speedIncrease: 8,
            scoreMultiplier: 1,
            color: "#F44336",
            wallCollision: true,
            obstacles: 6
        }
    };
    
    let snake = [];
    let apple = {};
    let obstacles = [];
    let direction = 'right';
    let nextDirection = 'right';
    let gameSpeed = 150; // 毫秒
    let gameInterval = null;
    let animationFrameId = null;
    let lastUpdateTime = 0;
    let score = 0;
    let currentDifficulty = 'medium';
    
    // 使用共用儲存工具或回退到 localStorage
    const getHighScore = (difficulty) => {
        if (Storage) {
            return Storage.getScore('snake', difficulty);
        } else {
            return parseInt(localStorage.getItem(`snakeHighScore${capitalizeFirstLetter(difficulty)}`)) || 0;
        }
    };
    
    const saveHighScore = (difficulty, score) => {
        if (Storage) {
            Storage.saveScore('snake', difficulty, score);
        } else {
            localStorage.setItem(`snakeHighScore${capitalizeFirstLetter(difficulty)}`, score);
        }
    };
    
    let highScores = {
        easy: getHighScore('easy'),
        medium: getHighScore('medium'),
        hard: getHighScore('hard')
    };
    let gameRunning = false;
    let gamePaused = false;
    let gameStarted = false;
    
    // 清理遊戲資源
    function cleanupGame() {
        if (gameInterval) {
            clearInterval(gameInterval);
            gameInterval = null;
        }
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }
    
    // 初始化遊戲
    function initGame() {
        // 初始化蛇
        snake = [
            {x: 5, y: 10},
            {x: 4, y: 10},
            {x: 3, y: 10}
        ];
        
        // 根據難度初始化遊戲速度
        gameSpeed = difficultySettings[currentDifficulty].initialSpeed;
        
        // 初始化蘋果
        generateApple();
        
        // 初始化障礙物（根據難度）
        generateObstacles();
        
        // 重置遊戲狀態
        direction = 'right';
        nextDirection = 'right';
        score = 0;
        scoreElement.textContent = score;
        difficultyElement.textContent = difficultySettings[currentDifficulty].name;
        highScoreElement.textContent = highScores[currentDifficulty];
        
        // 清除遊戲結束畫面
        gameOverScreen.style.display = 'none';
        newHighScoreElement.style.display = 'none';
        
        // 繪製初始遊戲畫面
        drawGame();
    }
    
    // 生成蘋果
    function generateApple() {
        // 隨機生成蘋果位置
        let appleOnSnake;
        let appleOnObstacle;
        
        do {
            appleOnSnake = false;
            appleOnObstacle = false;
            apple = {
                x: Math.floor(Math.random() * gridWidth),
                y: Math.floor(Math.random() * gridHeight)
            };
            
            // 檢查蘋果是否在蛇身上
            for (let segment of snake) {
                if (segment.x === apple.x && segment.y === apple.y) {
                    appleOnSnake = true;
                    break;
                }
            }
            
            // 檢查蘋果是否在障礙物上
            if (!appleOnSnake) {
                for (let obstacle of obstacles) {
                    if (obstacle.x === apple.x && obstacle.y === apple.y) {
                        appleOnObstacle = true;
                        break;
                    }
                }
            }
        } while (appleOnSnake || appleOnObstacle);
    }
    
    // 生成障礙物
    function generateObstacles() {
        obstacles = [];
        const obstacleCount = difficultySettings[currentDifficulty].obstacles;
        
        for (let i = 0; i < obstacleCount; i++) {
            let obstacleOnSnake;
            let obstacleOnApple;
            let obstacleOnOtherObstacle;
            let obstacle;
            
            do {
                obstacleOnSnake = false;
                obstacleOnApple = false;
                obstacleOnOtherObstacle = false;
                
                obstacle = {
                    x: Math.floor(Math.random() * gridWidth),
                    y: Math.floor(Math.random() * gridHeight)
                };
                
                // 檢查障礙物是否在蛇身上
                for (let segment of snake) {
                    if (segment.x === obstacle.x && segment.y === obstacle.y) {
                        obstacleOnSnake = true;
                        break;
                    }
                }
                
                // 檢查障礙物是否在蘋果上
                if (!obstacleOnSnake && apple.x === obstacle.x && apple.y === obstacle.y) {
                    obstacleOnApple = true;
                }
                
                // 檢查障礙物是否在其他障礙物上
                if (!obstacleOnSnake && !obstacleOnApple) {
                    for (let otherObstacle of obstacles) {
                        if (otherObstacle.x === obstacle.x && otherObstacle.y === obstacle.y) {
                            obstacleOnOtherObstacle = true;
                            break;
                        }
                    }
                }
                
                // 避免障礙物出現在起始位置附近
                if (!obstacleOnSnake && !obstacleOnApple && !obstacleOnOtherObstacle) {
                    const startX = 3;
                    const startY = 10;
                    const distance = Math.abs(obstacle.x - startX) + Math.abs(obstacle.y - startY);
                    if (distance < 5) {
                        obstacleOnSnake = true; // 重新生成
                    }
                }
            } while (obstacleOnSnake || obstacleOnApple || obstacleOnOtherObstacle);
            
            obstacles.push(obstacle);
        }
    }
    
    // 繪製遊戲
    function drawGame() {
        // 清除畫布
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 繪製障礙物
        for (let obstacle of obstacles) {
            ctx.fillStyle = '#666';
            ctx.fillRect(obstacle.x * gridSize, obstacle.y * gridSize, gridSize - 1, gridSize - 1);
            
            // 障礙物圖案
            ctx.fillStyle = '#888';
            ctx.beginPath();
            ctx.arc(
                obstacle.x * gridSize + gridSize/2,
                obstacle.y * gridSize + gridSize/2,
                gridSize/3,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
        
        // 繪製蛇
        snake.forEach((segment, index) => {
            // 蛇頭用不同顏色
            if (index === 0) {
                ctx.fillStyle = '#4CAF50'; // 蛇頭顏色
            } else {
                ctx.fillStyle = '#8BC34A'; // 蛇身顏色
            }
            
            // 繪製蛇身
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
            
            // 蛇身圓角效果
            ctx.fillStyle = '#7CB342';
            ctx.beginPath();
            ctx.arc(
                segment.x * gridSize + gridSize/2,
                segment.y * gridSize + gridSize/2,
                gridSize/2 - 1,
                0,
                Math.PI * 2
            );
            ctx.fill();
            
            // 蛇眼（只畫在蛇頭上）
            if (index === 0) {
                ctx.fillStyle = '#000';
                
                // 根據方向畫眼睛
                let eyeOffsetX = 0;
                let eyeOffsetY = 0;
                
                if (direction === 'right') {
                    eyeOffsetX = gridSize/3;
                } else if (direction === 'left') {
                    eyeOffsetX = -gridSize/3;
                } else if (direction === 'up') {
                    eyeOffsetY = -gridSize/3;
                } else if (direction === 'down') {
                    eyeOffsetY = gridSize/3;
                }
                
                ctx.beginPath();
                ctx.arc(
                    segment.x * gridSize + gridSize/2 + eyeOffsetX,
                    segment.y * gridSize + gridSize/2 + eyeOffsetY,
                    gridSize/8,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
        });
        
        // 繪製蘋果
        ctx.fillStyle = '#FF5252'; // 蘋果顏色
        ctx.beginPath();
        ctx.arc(
            apple.x * gridSize + gridSize/2,
            apple.y * gridSize + gridSize/2,
            gridSize/2 - 1,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // 蘋果葉子
        ctx.fillStyle = '#388E3C';
        ctx.beginPath();
        ctx.ellipse(
            apple.x * gridSize + gridSize/2,
            apple.y * gridSize + gridSize/4,
            gridSize/4,
            gridSize/8,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // 繪製網格
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 1;
        
        // 垂直線
        for (let x = 0; x <= canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        // 水平線
        for (let y = 0; y <= canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        // 繪製難度標示和分數
        ctx.fillStyle = difficultySettings[currentDifficulty].color;
        ctx.font = "bold 16px Arial";
        ctx.fillText(`難度: ${difficultySettings[currentDifficulty].name}`, 10, 25);
        ctx.fillText(`分數: ${score}`, 10, 45);
    }
    
    // 更新遊戲狀態
    function updateGame() {
        if (gamePaused) return;
        
        // 更新方向
        direction = nextDirection;
        
        // 計算蛇頭新位置
        const head = {...snake[0]};
        
        switch(direction) {
            case 'up':
                head.y -= 1;
                break;
            case 'down':
                head.y += 1;
                break;
            case 'left':
                head.x -= 1;
                break;
            case 'right':
                head.x += 1;
                break;
        }
        
        // 檢查是否撞牆
        if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
            gameOver();
            return;
        }
        
        // 檢查是否撞到自己
        for (let segment of snake) {
            if (head.x === segment.x && head.y === segment.y) {
                gameOver();
                return;
            }
        }
        
        // 檢查是否撞到障礙物
        for (let obstacle of obstacles) {
            if (head.x === obstacle.x && head.y === obstacle.y) {
                gameOver();
                return;
            }
        }
        
        // 移動蛇
        snake.unshift(head);
        
        // 檢查是否吃到蘋果
        if (head.x === apple.x && head.y === apple.y) {
            // 每次食到嘢加 10 分
            score += 10;
            scoreElement.textContent = score;
            
            // 更新最高分
            if (score > highScores[currentDifficulty]) {
                highScores[currentDifficulty] = score;
                highScoreElement.textContent = highScores[currentDifficulty];
                
                // 保存到localStorage
                localStorage.setItem(`snakeHighScore${capitalizeFirstLetter(currentDifficulty)}`, score);
            }
            
            // 根據難度加快遊戲速度
            const speedDecrease = difficultySettings[currentDifficulty].speedIncrease;
            if (gameSpeed > 50) {
                gameSpeed = Math.max(50, gameSpeed - speedDecrease);
                clearInterval(gameInterval);
                gameInterval = setInterval(updateGame, gameSpeed);
            }
            
            // 生成新蘋果
            generateApple();
        } else {
            // 如果沒吃到蘋果，移除蛇尾
            snake.pop();
        }
        
        // 繪製遊戲
        drawGame();
    }
    
    // 遊戲結束
    function gameOver() {
        gameRunning = false;
        clearInterval(gameInterval);
        
        // 檢查是否刷新紀錄
        const newHighScore = score > highScores[currentDifficulty];
        
        // 顯示遊戲結束畫面
        gameOverScreen.style.display = 'flex';
        
        // 更新分數顯示（更新 span 元素）
        if (finalScoreValueElement) {
            finalScoreValueElement.textContent = score;
        } else {
            // 回退到舊方法
            finalScoreElement.textContent = `分數: ${score}`;
        }
        
        if (finalHighScoreValueElement) {
            finalHighScoreValueElement.textContent = highScores[currentDifficulty];
        } else {
            // 回退到舊方法
            finalHighScoreElement.textContent = `最高分: ${highScores[currentDifficulty]}`;
        }
        
        // 如果刷新紀錄，顯示提示
        if (newHighScore) {
            newHighScoreElement.style.display = 'block';
        }
        
        // 更新按鈕文字
        startBtn.textContent = '再玩一次';
    }
    
    // 開始遊戲
    function startGame() {
        if (!gameStarted) {
            // 隱藏開始畫面
            startScreen.style.display = 'none';
            gameStarted = true;
        }
        
        if (!gameRunning) {
            initGame();
            gameRunning = true;
            gamePaused = false;
            startBtn.textContent = '重新開始';
            pauseBtn.textContent = '暫停';
            
            // 開始遊戲循環
            gameInterval = setInterval(updateGame, gameSpeed);
        }
    }
    
    // 暫停/繼續遊戲
    function togglePause() {
        if (!gameRunning) return;
        
        gamePaused = !gamePaused;
        
        if (gamePaused) {
            pauseBtn.textContent = '繼續';
            clearInterval(gameInterval);
        } else {
            pauseBtn.textContent = '暫停';
            gameInterval = setInterval(updateGame, gameSpeed);
        }
    }
    
    // 改變方向
    function changeDirection(newDirection) {
        // 防止直接反向移動
        if (
            (newDirection === 'up' && direction !== 'down') ||
            (newDirection === 'down' && direction !== 'up') ||
            (newDirection === 'left' && direction !== 'right') ||
            (newDirection === 'right' && direction !== 'left')
        ) {
            nextDirection = newDirection;
        }
    }
    
    // 更改難度
    function changeDifficulty(newDifficulty) {
        // 更新當前難度
        currentDifficulty = newDifficulty;
        
        // 更新按鈕樣式
        difficultyButtons.forEach(btn => {
            if (btn.dataset.difficulty === newDifficulty) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // 更新顯示的難度
        difficultyElement.textContent = difficultySettings[currentDifficulty].name;
        
        // 更新顯示的最高分
        highScoreElement.textContent = highScores[currentDifficulty];
        
        // 如果遊戲正在運行，重新初始化遊戲
        if (gameRunning) {
            initGame();
            clearInterval(gameInterval);
            gameInterval = setInterval(updateGame, gameSpeed);
        }
    }
    
    // 輔助函數：首字母大寫
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // 開始畫面功能
    function handleStartScreenKey(event) {
        if (!gameStarted) {
            startGame();
        }
    }
    
    // 鍵盤控制
    document.addEventListener('keydown', (event) => {
        // 處理開始畫面
        if (!gameStarted) {
            handleStartScreenKey(event);
            return;
        }
        
        switch(event.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                changeDirection('up');
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                changeDirection('down');
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                changeDirection('left');
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                changeDirection('right');
                break;
            case ' ':
                // 空格鍵暫停
                if (gameRunning) {
                    togglePause();
                } else {
                    startGame();
                }
                break;
        }
    });
    
    // 按鈕事件監聽
    startBtn.addEventListener('click', startGame);
    pauseBtn.addEventListener('click', togglePause);
    restartBtn.addEventListener('click', startGame);
    
    // 難度按鈕事件監聽
    difficultyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            changeDifficulty(btn.dataset.difficulty);
        });
    });
    
    // 移動控制按鈕事件
    upBtn.addEventListener('click', () => changeDirection('up'));
    downBtn.addEventListener('click', () => changeDirection('down'));
    leftBtn.addEventListener('click', () => changeDirection('left'));
    rightBtn.addEventListener('click', () => changeDirection('right'));
    
    // 觸摸控制 (防止手機滑動)
    upBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        changeDirection('up');
    });
    
    downBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        changeDirection('down');
    });
    
    leftBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        changeDirection('left');
    });
    
    rightBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        changeDirection('right');
    });
    
    // 點擊開始畫面開始遊戲
    startScreen.addEventListener('click', () => {
        if (!gameStarted) {
            startGame();
        }
    });
    
    // 初始化遊戲
    initGame();
    highScoreElement.textContent = highScores[currentDifficulty];
    
    // 顯示開始畫面
    startScreen.style.display = 'flex';
});