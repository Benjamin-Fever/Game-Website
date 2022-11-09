const socket = io();

sounds = []

document.addEventListener('DOMContentLoaded', () => {
    socket.emit("requestSounds")
})

function keyPress(event){
    button = event.target.id;
    socket.emit("playSound", button);
}

socket.on("updateSounds", data => {
    buttonBox = document.getElementById("box");
    data = JSON.parse(data);
    buttonBox.innerHTML = "";

    for (let i = 0; i < data.length; i++){
        buttonBox.innerHTML += '<div class="buttons" unselectable="on" onselect="return false" onmousedown="return false" id="' + data[i] + '">' + data[i] + '</div>';
    }

    buttonBox.innerHTML += '<div class="buttons" id="close" unselectable="on" onselect="return false" onmousedown="return false">Close Console</div>';

    buttons = document.getElementsByClassName("buttons");

    for (let i = 0; i < buttons.length; i++){ buttons[i].addEventListener("click", keyPress); }
})