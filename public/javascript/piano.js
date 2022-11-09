document.addEventListener('DOMContentLoaded', () => {

    whiteKeys = document.getElementsByClassName("whiteKey");
    blackKeys = document.getElementsByClassName("blackKey");
    volume = document.getElementById("volume");

    for (let i = 0; i < whiteKeys.length; i++){ whiteKeys[i].addEventListener("click", keyPress); }
    for (let i = 0; i < blackKeys.length; i++){ blackKeys[i].addEventListener("click", keyPress); }
})

function keyPress(event){
    key = event.target;
    sound = new Audio('audio/piano/' + key.id + '.mp3');
    sound.volume = volume.value / 100;
    
    sound.play();
}