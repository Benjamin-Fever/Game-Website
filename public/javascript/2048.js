const socket = io();
score = 0;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("form").addEventListener('submit', handleForm);
    randomSquare();
    randomSquare();
    updateColors();
    socket.emit("query", "SELECT * FROM scoreboard2048 ORDER BY score DESC");
})

document.addEventListener('keydown', keyPress);

socket.on("queryResults", data => {
    if (!Array.isArray(data)) { return; }
    
    table = document.getElementById("scoreboard");
    table.innerHTML = "<tr><th>Name</th><th>Score</th></tr>";
    for (let i = 0; i < data.length; i++){
        table.innerHTML += '<tr><td>' + data[i]["name"] + '</td><td>' + data[i]["score"] + '</td></tr>'
    }
})

function keyPress(e){
    key = e.key.toLowerCase();

    switch (key){
        case "w":
            shiftUp();
            break;
        
        case "a":
            shiftLeft();
            break;

        case "s":
            shiftDown();
            break;

        case "d":
            shiftRight();
            break;

        default:
            return;
    }

    randomSquare();
    updateColors();
    resetUpdates();
}

function resetUpdates(){
    slots = Array.from(document.getElementsByClassName("slot"));

    for (i = 0; i < 16; i++){ slots[i].classList.remove("updated"); }
}

function shiftUp(){
    slots = Array.from(document.getElementsByClassName("slot"));

    map = [
        slots.slice(0, 4),
        slots.slice(4, 8),
        slots.slice(8, 12),
        slots.slice(12, 16)
    ]

    for (let y = 0; y < 4; y++){
        for (let x = 0; x < 4; x++){
            if (y-1 >= 0){
                if (map[y][x].classList[1] == "updated") { continue; }
                if (map[y-1][x].innerText == ""){
                    i = 0
                    while (y-(1 + i) >= 0 && map[y-(1 + i)][x].innerText == ""){
                        map[y-(1 + i)][x].innerText = map[y - i][x].innerText;
                        map[y - i][x].innerText = "";
                        i++;
                    }
                }
                else if (map[y-1][x].innerText == map[y][x].innerText){
                    map[y-1][x].innerText = map[y-1][x].innerText * 2;
                    score += map[y-1][x].innerText * 1;
                    map[y][x].innerText = "";
                    map[y-1][x].classList.add("updated")
                }
            }
        }
    }

    for (let y = 0; y < 4; y++){
        for (let x = 0; x < 4; x++){
            if (map[y][x].classList[1] == "updated") { continue; }
            if (y-1 >= 0){
                if (map[y-1][x].innerText == map[y][x].innerText && map[y][x].innerText != ""){
                    map[y-1][x].innerText = map[y-1][x].innerText * 2;
                    score += map[y-1][x].innerText * 1;
                    map[y][x].innerText = "";
                    map[y-1][x].classList.add("updated")
                }
            }
        }
    }
}

function shiftDown(){
    slots = Array.from(document.getElementsByClassName("slot"));

    map = [
        slots.slice(0, 4),
        slots.slice(4, 8),
        slots.slice(8, 12),
        slots.slice(12, 16)
    ]

    for (let y = 3; y > -1; y--){
        for (let x = 0; x < 4; x++){
            if (y+1 <= 3){
                if (map[y][x].classList[1] == "updated") { continue; }

                if (map[y+1][x].innerText == ""){
                    i = 0
                    while (y+(1 + i) <= 3 && map[y+(1 + i)][x].innerText == ""){
                        map[y+(1 + i)][x].innerText = map[y + i][x].innerText;
                        map[y + i][x].innerText = "";
                        i++;
                    }
                }
                else if (map[y+1][x].innerText == map[y][x].innerText){
                    map[y+1][x].innerText = map[y+1][x].innerText * 2;
                    score += map[y+1][x].innerText * 1;
                    map[y][x].innerText = "";
                    map[y+1][x].classList.add("updated")
                }
            }
        }
    }

    for (let y = 3; y > -1; y--){
        for (let x = 0; x < 4; x++){
            if (y+1 <= 3){
                if (map[y][x].classList[1] == "updated") { continue; }
                if (map[y+1][x].innerText == map[y][x].innerText && map[y][x].innerText != ""){
                    map[y+1][x].innerText = map[y+1][x].innerText * 2;
                    score += map[y+1][x].innerText * 1;
                    map[y][x].innerText = "";
                    map[y+1][x].classList.add("updated")
                }
            }
        }
    }
}

function shiftLeft(){
    slots = Array.from(document.getElementsByClassName("slot"));

    map = [
        slots.slice(0, 4),
        slots.slice(4, 8),
        slots.slice(8, 12),
        slots.slice(12, 16)
    ]

    for (let y = 0; y < 4; y++){
        for (let x = 0; x < 4; x++){
            if (x-1 >= 0){
                if (map[y][x].classList[1] == "updated") { continue; }
                if (map[y][x-1].innerText == ""){
                    i = 0
                    while (x-(1 + i) >= 0 && map[y][x-(1 + i)].innerText == ""){
                        map[y][x-(1 + i)].innerText = map[y][x - i].innerText;
                        map[y][x - i].innerText = "";
                        i++;
                    }
                }
                else if (map[y][x-1].innerText == map[y][x].innerText){
                    map[y][x-1].innerText = map[y][x-1].innerText * 2;
                    score += map[y][x-1].innerText * 1;
                    map[y][x].innerText = "";
                    map[y][x-1].classList.add("updated")
                }
            }
        }
    }

    for (let y = 0; y < 4; y++){
        for (let x = 0; x < 4; x++){
            if (x-1 >= 0){
                if (map[y][x].classList[1] == "updated") { continue; }
                if (map[y][x-1].innerText == map[y][x].innerText && map[y][x].innerText != ""){
                    map[y][x-1].innerText = map[y][x-1].innerText * 2;
                    score += map[y][x-1].innerText * 1;
                    map[y][x].innerText = "";
                    map[y][x-1].classList.add("updated")
                }
            }
        }
    }
}

function shiftRight(){
        slots = Array.from(document.getElementsByClassName("slot"));
    
        map = [
            slots.slice(0, 4),
            slots.slice(4, 8),
            slots.slice(8, 12),
            slots.slice(12, 16)
        ]
    
        for (let y = 0; y < 4; y++){
            for (let x = 3; x > -1; x--){
                if (x+1 <= 3){
                    if (map[y][x].classList[1] == "updated") { continue; }
                    if (map[y][x+1].innerText == ""){
                        i = 0
                        while (x+(1 + i) <= 3 && map[y][x+(1 + i)].innerText == ""){
                            map[y][x+(1 + i)].innerText = map[y][x + i].innerText;
                            map[y][x + i].innerText = "";
                            i++;
                        }
                    }
                    else if (map[y][x+1].innerText == map[y][x].innerText){
                        map[y][x+1].innerText = map[y][x+1].innerText * 2;
                        score += map[y][x+1].innerText * 1;
                        map[y][x].innerText = "";
                        map[y][x+1].classList.add("updated")
                    }
                }
            }
        }

        for (let y = 0; y < 4; y++){
            for (let x = 3; x > -1; x--){
                if (x+1 <= 3){
                    if (map[y][x].classList[1] == "updated") { continue; }
                    if (map[y][x+1].innerText == map[y][x].innerText && map[y][x].innerText != ""){
                        map[y][x+1].innerText = map[y][x+1].innerText * 2;
                        score += map[y][x+1].innerText * 1;
                        map[y][x].innerText = "";
                        map[y][x+1].classList.add("updated")
                    }
                }
            }
        }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function randomSquare(){
    slots = Array.from(document.getElementsByClassName("slot"));
    
    map = [
        slots.slice(0, 4),
        slots.slice(4, 8),
        slots.slice(8, 12),
        slots.slice(12, 16)
    ]

    for (let i = 0; i < 16; i++){
        x = getRandomInt(4);
        y = getRandomInt(4);
        if (map[y][x].innerText == ""){
            if (getRandomInt(5) == 4){ map[y][x].innerText = 4;}
            else { map[y][x].innerText = 2;}
            document.getElementById("score").innerText = "Score: " + score;
            return;
        }
    }

    
}

function updateColors(){
    slots = Array.from(document.getElementsByClassName("slot"));
    for (i = 0; i < 16; i++){ slots[i].parentElement.style.backgroundColor = "white" }
    
    for (i = 0; i < 16; i++){
        if (slots[i].innerText == ""){ continue; }
        else if (slots[i].innerText == "2"){
            slots[i].parentElement.style.backgroundColor = "rgb(224, 224, 224)";
        }
        else if (slots[i].innerText == "4"){
            slots[i].parentElement.style.backgroundColor = "rgb(241, 246, 191)";
        }
        else if (slots[i].innerText == "8" || slots[i].innerText == "16"){
            slots[i].parentElement.style.backgroundColor = "rgb(253, 155, 43)";
        }
        else if (slots[i].innerText == "32"){
            slots[i].parentElement.style.backgroundColor = "rgb(255, 68, 68)";
        }
        else if (slots[i].innerText == "64"){
            slots[i].parentElement.style.backgroundColor = "rgb(248, 20, 20)";
        }
        else if (slots[i].innerText == "128" || slots[i].innerText == "256"){
            slots[i].parentElement.style.backgroundColor = "rgb(253, 214, 43)";
        }
        else if (slots[i].innerText == "512" || slots[i].innerText == "1024" || slots[i].innerText == "2048"){
            slots[i].parentElement.style.backgroundColor = "rgb(251, 207, 13)";
        }
        else{
            slots[i].parentElement.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        }
    }
    
}

function handleForm(event) { event.preventDefault(); }

function updateScoreboard(){
    var name = document.getElementById("name").value;
    socket.emit("query", "INSERT INTO scoreboard2048 (name, score) VALUES ('" + name + "', " + score + ")");
    socket.emit("query", "SELECT * FROM scoreboard2048 ORDER BY score DESC");
}