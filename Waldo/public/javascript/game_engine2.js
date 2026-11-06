var waldoX = 0;
var waldoY = 0;
var gameId = document.getElementById("game_id").value;

let timerInterval;
let seconds = 0;
function loadGame(){

    waldoX = document.getElementById("waldo_x").value;
    waldoY = document.getElementById("waldo_y").value;

    seconds = 0;

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        seconds++;
        let minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
        let remainingSeconds = String(seconds % 60).padStart(2, '0');

        document.getElementById("timer-mins").innerHTML = minutes;
        document.getElementById("timer-secs").innerHTML = remainingSeconds;

    }, 1000);
}

const distance = 35; // how far away you can click from Waldo

const img = document.querySelector("#game-img");
img.addEventListener("click", (event) => {
    const rect = img.getBoundingClientRect();

    const x = (event.clientX - rect.left) * (img.naturalWidth / rect.width);
    const y = (event.clientY - rect.top) * (img.naturalHeight / rect.height);

    console.log("Posición X en la imagen:", x);
    console.log("Posición Y en la imagen:", y);

    if ((x - distance < waldoX && x + distance > waldoX) && (y - distance < waldoY && y + distance > waldoY)){
        win();
    }

});

const pointer = document.querySelector("#pointer");
document.addEventListener("click", (event) => {
    pointer.classList.remove("hidden-pointer");
    pointer.classList.add("grow");
    pointer.style.left = `${event.clientX}px`;
    pointer.style.top = `${event.clientY}px`;

    setTimeout(() => {
        pointer.classList.add("hidden-pointer");
        pointer.classList.remove("grow");
    }, 500);
});

// const cursor = document.querySelector("#custom-cursor");
// document.addEventListener("mousemove", (event) => {
//     cursor.style.left = `${event.clientX}px`;
//     cursor.style.top = `${event.clientY}px`;
// });

function win(){
    confetti({
        particleCount: 450,
        spread: 100,
        origin: { y: 0.6 }
    });
    clearInterval(timerInterval);
    document.getElementById("win-modal").showModal();
}

function closeScore(){
    window.location.href = "/games";
}

async function submit(){
    var player = document.getElementById("name").value;
    if (player.trim().length == 0){
        iziToast.error({
            message: 'Enter your name to save your score!',
            position: 'bottomRight',
            timeout: 5000,
            close: true
        });
    }else{
        console.log("sending scores!")
        const response = await fetch("/scores", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                player: player,
                game: gameId,
                seconds: seconds
             })
        });
        const data = await response.json();
        window.location.href = data.redirect;
    }
}