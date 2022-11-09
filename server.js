/// Online Server connection
// Import all modules
const express    = require('express');
const path       = require('path');
const http       = require('http');
const socketio   = require('socket.io');
const mysql      = require('mysql');
const { connect } = require('http2');
const PORT       = process.env.PORT || 80;
const app        = express();
const server     = http.createServer(app);
const io         = socketio(server);

var sockets = [];
var gameCodes = [];
var games = {};
var pythonSocket = undefined;
var soundBoard = undefined;




// Setup html
app.use(express.static(path.join(__dirname, "public")));

// Setup server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Make SQL connection
var con = mysql.createConnection({host: "localhost", user: "root", password: "Benjaminfever13", database: "gameserver"});


con.connect(function(err) {
    
    if (err) throw err;
     
    io.on('connection', socket => {
        sockets.push(socket);
        console.log("Socket Connected")
        socket.on("query", query => { socketQuery(socket, query); })

        socket.on("createGame", gameData => { createGame(socket, gameData["gameCode"], gameData["gameName"]); })

        socket.on("joinGame", gameCode => { joinGame(socket, gameCode); })

        socket.on("action", data =>{ action(socket, data); })

        socket.on("disconnect", socket => { socketDisconnect(socket); })

        socket.on("gameExists", gameCode => {
            if (gameCodes.includes(gameCode)){ socket.emit("checkedCode", true);}
            else{ socket.emit("checkedCode", false);}
        })

        socket.on("playerConnected", data => {
            if (data[0] === "red"){
                games[data[0]]["sockets"]["blue"].emit("playerConnected", games[data[0]]["turn"]);
            }
            else{
                games[data[0]]["sockets"]["red"].emit("playerConnected", games[data[0]]["turn"]);
            }
        })

        socket.on("python_connect", () => { pythonSocket = socket; })

        socket.on("playSound", data => {
            if (pythonSocket == undefined) { return; }
            pythonSocket.emit("play_sound", data);
        })

        socket.on("soundButtons", data => {
            soundBoard = data;
            for (let i = 0; i < sockets.length; i++){
                sockets[i].emit("updateSounds", data);
            }
        })

        socket.on("requestSounds", () => { socket.emit("updateSounds", soundBoard); })
    })
});


function socketQuery(socket, query){
    con.query(query, function (err, result, fields) {
        if (err) { throw err; }
        socket.emit("queryResults", result);
    });
}

function createGame(socket, gameCode, gameName){
    gameCodes.push(gameCode);

    if (gameName == "connect4"){
        games[gameCode] = {
            "sockets": { "red": socket, "blue": undefined },
            "game": "connect4",
            "board": [
                ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
                ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
                ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
                ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
                ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
                ["empty", "empty", "empty", "empty", "empty", "empty", "empty"]
            ],
            "turn": "red",
            "userCount": 1,
            "maxUsers": 2
        };
    }
}

function joinGame(socket, gameCode){
    if (!gameCodes.includes(gameCode)){ return; }

    var game = games[gameCode];

    if (game["maxUsers"] < game["userCount"]){ return; }

    game["userCount"] += 1;

    if (game["game"] == "connect4"){

        if (game["sockets"]["red"] == undefined){
            game["sockets"]["red"] = socket;
            socket.emit("connectedToGame", "red");
            socket.emit("updateTurn", game["turn"]);
            socket.emit("updateBoard", game["board"]);
            if (game["sockets"]["blue"] != undefined){
                game["sockets"]["blue"].emit("updateTurn", game["turn"])
            }
        }
        else{
            game["sockets"]["blue"] = socket;
            socket.emit("connectedToGame", "blue");
            socket.emit("updateTurn", game["turn"]);
            socket.emit("updateBoard", game["board"]);
            if (game["sockets"]["red"] != undefined){
                game["sockets"]["red"].emit("updateTurn", game["turn"])
            }
        }
    }
}

function socketDisconnect(socket){
    for (var gameCode in games) {
        var game = games[gameCode];
        if (game["game"] == "connect4"){
            if (!((game["sockets"]["blue"] == undefined || game["sockets"]["blue"].disconnected) && (game["sockets"]["red"] == undefined || game["sockets"]["red"].disconnected))){
                if (game["sockets"]["blue"] == undefined || game["sockets"]["blue"].disconnected){ game["sockets"]["red"].emit("opponentDisconnected") }
                else if (game["sockets"]["red"] == undefined || game["sockets"]["red"].disconnected){ game["sockets"]["blue"].emit("opponentDisconnected") }
            }

            if (game["sockets"]["blue"] != undefined &&  game["sockets"]["blue"].disconnected){
                game["userCount"] -= 1;
                game["sockets"]["blue"] = undefined;
            }
            if (game["sockets"]["red"] != undefined && game["sockets"]["red"].disconnected){
                game["userCount"] -= 1;
                game["sockets"]["red"] = undefined;
            }
        }  
    }
    sockets.splice(sockets.indexOf(socket), 1);
}


function action(socket, data){
    var game = games[data["gameCode"]];
    if (game["game"] == "connect4"){
        game["board"][data["x"]][data["y"]] = data["player"];

        if (data["player"] === "red"){ game["turn"] = "blue"; }
        else if(data["player"] === "blue"){ game["turn"] = "red"; }

        game["sockets"]["blue"].emit("updateBoard", game["board"]);
        game["sockets"]["red"].emit("updateBoard", game["board"]);

        game["sockets"]["blue"].emit("updateTurn", game["turn"]);
        game["sockets"]["red"].emit("updateTurn", game["turn"]);
    }

    
}