//点击开始游戏--》生成food--》生成小蛇

var startBtn = document.getElementById('startBtn');
var startPage = document.getElementById('startPage');
var startAndPause = document.getElementById('startAndPause');
var content = document.getElementById('content');
var end = document.getElementById('end');
var scoreBox = document.getElementById('scoreBox'); 
var endScore = document.getElementById('endScore');
var close = document.getElementById('close');
var startP = document.getElementById('startP');
var game;
var ongoingBool = false;
var newGameBool = true;


init();
bindEvent();

function init(){
    //地图
    this.mapW = parseInt(getComputedStyle(content).width);
    this.mapH = parseInt(getComputedStyle(content).height);
    //食物
    this.foodH = 20;
    this.foodW = 20;
    this.foodX = 0;
    this.foodY = 0;
    //小蛇
    this.snakeW = 20;
    this.snakeH = 20;
    this.snakeBody = [[3,1,'head'],[2,1,'body'],[1,1,'body']];
    //游戏
    this.direct = 'right';
    this.left = false;
    this.up = true;
    this.right = false;
    this.down = true;
    this.score = 0;
}

function bindEvent(){
    startBtn.onclick = function(){
        startPage.style.display = 'none';
        startAndPause.style.display = 'block';
        console.log('start game');
        startGame();
    };
    close.onclick = function(){
        end.style.display = 'none';
    };
    startP.onclick = function(){
        if(newGameBool){
            if(!ongoingBool){
                init();
                scoreBox.innerHTML = 0;
                startGame();
                ongoingBool = true;
                newGameBool = false;
            }
        }else{
            console.log(ongoingBool);
            if(ongoingBool){
                console.log('stop');
                clearInterval(game);
                ongoingBool = false;
                startP.setAttribute('src','img/start.png');
            }else if(!ongoingBool){
                console.log('start');
                ongoingBool = true;
                game = setInterval(function(){
                    move();
                },200);
            }
        }
        // console.log('111');
    };
}

function startGame(){
    ongoingBool = true;
    console.log(ongoingBool);
    newGameBool = false;
    food();
    snake();
    bindEvent();
    game = setInterval(function(){
        move();
    },200);
    document.onkeydown = function(e){
        var code = e.keyCode;
        getDirect(code);
    }
}

function food(){
    var food = document.createElement('div');
    food.style.width = this.foodW + 'px';
    food.style.height = this.foodH + 'px';
    food.style.position = 'absolute';
    this.foodX = Math.floor(Math.random() * (this.mapW / 20));
    this.foodY = Math.floor(Math.random() * (this.mapH / 20))
    food.style.left = this.foodX * 20 + 'px';
    food.style.top = this.foodY * 20 + 'px';
    food.setAttribute('class','food');
    content.appendChild(food);
}

function snake(){
    for(var i = 0; i < this.snakeBody.length; i++){
        var snake = document.createElement('div');
        snake.style.width = this.snakeW + 'px';
        snake.style.height = this.snakeH + 'px';
        snake.style.position = 'absolute';
        snake.style.left = this.snakeBody[i][0] * 20 + 'px';
        snake.style.top = this.snakeBody[i][1] * 20 + 'px';
        snake.classList.add(this.snakeBody[i][2]);
        snake.classList.add('snake');
        switch(this.direct){
            case 'right':
                break;
            case 'up':
                snake.style.transform = 'rotate(270deg)';
                break;
            case 'left':
                snake.style.transform = 'rotate(180deg)';
                break;
            case 'down':
                snake.style.transform = 'rotate(90deg)';
                break;
        }
        content.appendChild(snake);
    }
}

function move(){
    for(var i = this.snakeBody.length - 1; i > 0; i --){
        this.snakeBody[i][0] = this.snakeBody[i - 1][0];
        this.snakeBody[i][1] = this.snakeBody[i - 1][1];
    }
    switch(this.direct){
        case 'right':
            this.snakeBody[0][0] += 1;
            break;
        case 'up':
            this.snakeBody[0][1] -= 1;
            break;
        case 'down':
            this.snakeBody[0][1] += 1;
            break;
        case 'left':
            this.snakeBody[0][0] -= 1;
            break;
    }

    //判断小蛇吃到苹果
    if(this.snakeBody[0][0] == this.foodX && this.snakeBody[0][1] == this.foodY){
        removeClass('food');
        this.score ++;
        var snakeNew = [,,];
        snakeNew[0] = this.snakeBody[this.snakeBody.length - 1][0];
        snakeNew[1] = this.snakeBody[this.snakeBody.length - 1][1];
        snakeNew[2] = 'body';
        switch(this.direct){
            case 'left':
                snakeNew[0] += 1;
                break;
            case 'right':
                snakeNew[0] -= 1;
                break;
            case 'up':
                snakeNew[1] -= 1;
                break;
            case 'down':
                snakeNew[1] += 1;
                break;
        }
        this.snakeBody.push(snakeNew);
        food();
    }
    removeClass('snake');
    snake();
    scoreBox.innerHTML = this.score;
    if(this.snakeBody[0][0] < 0 || this.snakeBody[0][0] > this.mapW / 20){
        // console.log(111);
        newGame();
    }
    if(this.snakeBody[0][1] < 0 || this.snakeBody[0][1] > this.mapH / 20){
        // console.log(111);
        newGame()
    }
    for(var i = 1; i < this.snakeBody.length; i++){
        if(this.snakeBody[0][0] == this.snakeBody[i][0] && this.snakeBody[0][1] == this.snakeBody[i][1]){
            // console.log(222);
            newGame();
        }
    }
}

function newGame(){
    clearInterval(game);
    removeClass('snake');
    removeClass('food');
    ongoingBool = false;
    newGameBool = true;
    end.style.display = 'block';
    endScore.innerHTML = this.score;
    this.score = 0;
    startP.setAttribute('src','img/start.png');
}

function removeClass(className){
    var obj = document.getElementsByClassName(className);
    while(obj.length > 0){
        obj[0].parentNode.removeChild(obj[0]);
    }
}

function getDirect(code){
    switch(code){
        case 37:
            if(this.left){
                this.direct = 'left';
                this.left = false;
                this.right = false;
                this.up = true;
                this.down = true;
            }
            break;
        case 38:
            if(this.up){
                this.direct = 'up';
                this.left = true;
                this.right = true;
                this.up = false;
                this.down = false;
            }
            break;
        case 39:
            if(this.right){
                this.direct = 'right';
                this.left = false;
                this.right = false;
                this.up = true;
                this.down = true;
            }
            break;
        case 40:
            if(this.down){
                this.direct = 'down';
                this.left = true;
                this.right = true;
                this.up = false;
                this.down = false;
            }
    }
}