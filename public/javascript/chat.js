const socket = io();
const cookies = readCookie();
var username = readUsername();

setInterval(() => { socket.emit("query", "SELECT * FROM chat ORDER BY timestamp ASC"); }, 100);

var form = document.getElementsByClassName("formClass")
function handleForm(event) { event.preventDefault(); }

for (var i =0; i < form.length; i++){ form[i].addEventListener('submit', handleForm); }

socket.on("queryResults", data => {
    if (!Array.isArray(data)) { return; }

    var txtField = document.getElementById("textBox");
    var chatvalue = "";
    for (var i = 0; i < data.length; i++){
        chatvalue += data[i]["username"].replace(/</g, "&lt;").replace(/>/g, "&gt;") + ": " + data[i]["message"].replace(/</g, "&lt;").replace(/>/g, "&gt;") + "<br>";
    }
    txtField.innerHTML = chatvalue;
})

function sendMessage(){
    var query = "INSERT INTO chat (username, message) VALUES (' " + username + "', ' " + document.getElementById("textChat").value + " ')"
    socket.emit("query", query);
    document.getElementById("textChat").value = "";
}

function updateUsername(){
    username = document.getElementById("usernameInput").value;
    document.getElementById("usernameInput").value = "";
    document.cookie = "username=" + username;
}

function readUsername(){
    var localName = cookies["username"];
    if (localName === undefined){ localName = "Unknown"; }
    return localName;
}

function readCookie(){
    let x = document.cookie;
    x = x.split('=');
    values = {};
    for (var i = 0; i < x.length; i += 2){
        values[x[i]] = x[i + 1];
    }
    return values;
}