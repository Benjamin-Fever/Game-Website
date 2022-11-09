const socket = io();
var verticalGrid;
var gameWindow;
var gameCode = "";
var player = "";
var curPlayer = "";

document.addEventListener('DOMContentLoaded', () => {

    gameWindow = document.querySelector('#game');
    gameWindow.className = "hidden";


    verticalGrid = document.querySelectorAll('.vertical-grid');

    for (let i = 0; i < 7; i++){
        for (let z = 0; z < 6; z++){
            verticalGrid[i].getElementsByClassName("cell")[z].id = "empty";
        }
        verticalGrid[i].onmouseover = function() { cellHover(verticalGrid[i].getElementsByClassName("cell")[0]) };
        verticalGrid[i].onmouseout = function() { cellUnhover(verticalGrid[i].getElementsByClassName("cell")[0]) };
        verticalGrid[i].onclick = function () { clickEvent(verticalGrid[i]); }
    }
    
});

socket.on("connectedToGame", p =>{
    socket.emit("playerConnected", [gameCode, p]);
    player = p;
    document.querySelector('#menu').className = "hidden";
    document.querySelector('#game').className = "";
    document.querySelector('#codeDisplay').innerHTML = "Game Code: " + gameCode;
    drawBoard()
})

socket.on("updateBoard", board => {
    for (var y = 0; y < board.length; y++){
        for (var x = 0; x < board[y].length; x++){
            if (!(board[y][x] === "empty")){
                verticalGrid[x].getElementsByClassName("cell")[y].style.background = board[y][x];
                verticalGrid[x].getElementsByClassName("cell")[y].id = board[y][x];
            }
            else{
                verticalGrid[x].getElementsByClassName("cell")[y].style.background = "white";
                verticalGrid[x].getElementsByClassName("cell")[y].id = board[y][x];
            }
        }
    }
})

socket.on("updateTurn", player => {
    curPlayer = player;
    document.querySelectorAll("#display")[0].innerHTML = "It is " + curPlayer + "'s turn";

    if (checkWin() != undefined){
        document.querySelectorAll("#display")[0].innerHTML = checkWin() + " win's";
        curPlayer = "";
    }
})

socket.on("opponentDisconnected", () => {
    curPlayer = "";
    document.querySelectorAll("#display")[0].innerHTML = "Waiting on other player";
})

socket.on("checkedCode", value => {
    if (value){ createGameCode(); return; }

    socket.emit("createGame", {"gameCode": gameCode, "gameName": "connect4"});
    player = "red";
    document.querySelector('#menu').className = "hidden";
    document.querySelector('#game').className = "";
    document.querySelectorAll("#display")[0].innerHTML = "Waiting on other player";
    document.querySelector('#codeDisplay').innerHTML = "Game Code: " + gameCode;
    drawBoard()
})

function cellHover(cell){
    if (cell.id === "empty" && curPlayer == player){
        cell.style.background = player;
    }
}

function cellUnhover(cell){
    if (cell.id === "empty" && curPlayer == player){
        cell.style.background = "white";
    }
}

function clickEvent(locverticalGrid){
    if (curPlayer != player) {return;}
    for (var i = 5; i >= 0 ; i--){
        if (locverticalGrid.getElementsByClassName("cell")[i].id === "empty"){
            locverticalGrid.getElementsByClassName("cell")[i].style.background = player;
            locverticalGrid.getElementsByClassName("cell")[i].id = player;
            if (player === "red") { curPlayer = "blue"; }
            if (player === "blue") { curPlayer = "red"; }
            for (var y = 0; y < verticalGrid.length; y++){
                if (verticalGrid[y] == locverticalGrid){
                    break;
                }
            }
            socket.emit("action", {"gameCode": gameCode, "x": i, "y": y, "player": player});
            
            if (checkWin() != undefined){
                document.querySelectorAll("#display")[0].innerHTML = checkWin() + " win's";
                curPlayer = "";
            }

            return;
        }
    }
}

function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function buttonClick(value){
    if (value === "join"){ document.getElementById('code').className = ""; }
    else if (value === "gameCodeSub"){
        gameCode = document.getElementById('gameCode').value;
        socket.emit("joinGame", gameCode);
    }
    else if (value === "host"){ createGameCode(); }
}

function createGameCode(){
    var list = [
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"
    ];
    for (var i = 0; i < 12; i++){
        gameCode += list[randomInt(0, list.length - 1)];
    }
    socket.emit("gameExists", gameCode);
}

function checkWin(){
    if (checkVertical("red") || checkHorizontal("red") || checkDiagonal("red")) { return "red"; }
    else if (checkVertical("blue") || checkHorizontal("blue") || checkDiagonal("blue")) { return "blue"; }
    else { return undefined; }
}

function drawBoard(){
    game = document.getElementById("gameGrid");
    for (let i = 0; i < 10; i++){
        game.innerHTML += `
            <div class="vertical-grid">
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
            </div>
    `
    }
}