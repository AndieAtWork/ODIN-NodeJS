console.log("engine running");

function start(){
    window.location.href = "/games";
}

function viewScores(){
    window.location.href = "/scores/";
}

function play(id){
    window.location.href = "/games/" + id;
}

function openScores(id, button){
    var buttons = document.querySelectorAll(".view");
    var options = document.querySelectorAll(".score-option");
    buttons.forEach(element => {
        element.classList.remove("selected-button");
    });
    options.forEach(element => {
        element.classList.remove("selected-option");
    });
    loadScores(id, false);
}

async function loadScores(id=1, first=true){
    console.log("loading scores!")

    const params = new URLSearchParams(window.location.search);
    const game = params.get("game");
    const playerId = params.get("playerId");

    let player = 0;
    if (first && Number.isInteger(Number(game)) && game >= 1 && game <= 6){
        id = game;
    }
    if (Number.isInteger(Number(playerId)) && playerId > 0){
        player = playerId;
    }

    const button = document.querySelectorAll(".view")[id - 1];
    button.classList.add("selected-button");
    button.parentElement.classList.add("selected-option");
    document.getElementById("game-number").innerHTML = String(id);

    console.log("game",game);
    console.log("playerId", playerId);

    var url = "/scores/" + id + "/" + player
    console.log("url", url)
    const response = await fetch(url, {
        method: "GET"
    });
    const data = await response.json();
    console.log(data);
    const allPlayerScores = data.data;
    var playerScore = 0;
    if (data.playerData.length > 0){
        playerScore = data.playerData[0].player_id;
    }

    const tableBody = document.getElementById("highscores");

    var html = '';
    for (var s in allPlayerScores){
        var number = String(parseInt(s) + 1);
        var scoreInfo = allPlayerScores[s];

        //console.log("info", scoreInfo);

        var highlight = "";
        if (scoreInfo.player_id == playerScore){
            highlight = " highlight ";
        }

        html += '<tr class="' + highlight + '">' +
                    '<td class="centered">' + number + '</td>' +
                    '<td class="centered">' + scoreInfo.username + '</td>' +
                    '<td class="centered">' + scoreInfo.time_score + '</td>' +
                    '<td class="centered">' + String(scoreInfo.date).split(".")[0].replace("T"," ") + '</td>' +
                '</tr>';
    }
    tableBody.innerHTML = html;
}