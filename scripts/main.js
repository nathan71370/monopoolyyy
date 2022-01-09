const playerObject = {
    name : null,
    color : null,
    position : 1,
    money : null,
    cities : new Array(),
    jailTurn : 0,
}

const cityObject = {
    name : null,
    sellValue : null,
    price : null,
    tax : null,
    color : null,
    position : null,
    playerOwning : null,
    upgradeLeft : 3,
    isMonopoly : false,
    isCity : null,
}

//variables
var mapLength = 8;
var rectSize = 100;
var moneyBase = 1000;
var mapSize = mapLength * 4 - 4;
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var whoplay = 0;
var bankrupt = -500;
var cities = new Array();

var players = new Array();

var colors = ["red", "yellow", "blue", "green"];

startGame();



function startGame(){
    initBoard();
    createPlayer("Charles");
    createPlayer("Nathan");
    drawPlayers();
    uiShow();
    
    
}

function initBoard(){
    initCities();
    drawCities();
    listenButtons();
}

function initCities(){
    //initialisation map
    createCity("START", 0, "palegreen", 1, false);
    createCity("RIO", 110, "green", 2,true);
    createCity("DELHI", 110, "green", 3,true);
    createCity("BANGKOK", 140, "dodgerblue", 4, true);
    createCity("BATEAU", 100, "grey", 5, true);
    createCity("CARIO", 150, "dodgerblue", 6, true);
    createCity("MADRID", 150, "dodgerblue", 7, true);
    createCity("CHANCE", 0, "maroon", 8, false);
    createCity("JAKARTA", 170, "darkmagenta", 9, true);
    createCity("BERLIN", 180, "darkmagenta", 10, true);
    createCity("MOSCOU", 200, "darkorange", 11, true);
    createCity("METRO", 150, "grey", 12, true);
    createCity("MOSCOU", 200, "darkorange", 13, true);
    createCity("MOSCOU", 200, "darkorange", 14, true);
    createCity("PRISON", 0, "black", 15, false);
    createCity("ZURICH", 250, "teal", 16, true);
    createCity("RIYADH", 250, "teal", 17, true);
    createCity("SYDNEY", 300, "sienna", 18, true);
    createCity("AMPOULE", 200, "grey", 19, true);
    createCity("BEIJING", 300, "sienna", 20, true);
    createCity("DUBAI", 300, "sienna", 21, true);
    createCity("ECHANGE", 0, "yellowgreen", 22, false);
    createCity("PARIS", 350, "rebeccapurple", 23, true);
    createCity("HONGKONG", 350, "rebeccapurple", 24, true);
    createCity("LONDON", 420, "red", 25, true);
    createCity("AVION", 250, "grey", 26, true);
    createCity("TOKYO", 450, "red", 27, true);
    createCity("NEW YORK", 450, "red", 28, true);
}


function createCity(name, price, color, position, isCity) {
    city = Object.create(cityObject);
    city.name = name;
    city.price = price;
    city.color = color;
    city.position = position;
    city.tax = Math.round(city.price / 3);
    city.sellValue = price * 0.8;
    if(isCity != undefined){
        city.isCity = isCity;
    }
    cities.push(city);
}

function createPlayer(name){
    var player = Object.create(playerObject);
    player.name = name;
    player.color = colors[players.length];
    player.money = moneyBase + players.length * 50;
    players.push(player);
}


function drawPlayers(){
    players.forEach(player => {
        var position = getPosXY(player.position);
        ctx.beginPath();
        ctx.arc(position[0] + canvas.clientWidth / 40 * players.indexOf(player) + rectSize/5, position[1] + canvas.clientWidth / 15, 10, 0, Math.PI*2, false);
        ctx.fillStyle = player.color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.stroke();
        ctx.closePath();
    });
}

function drawCities(){
    
    cities.forEach(city => {
            var position = getPosXY(city.position);
            ctx.beginPath();
            ctx.rect(position[0], position[1], rectSize, rectSize);
            ctx.fillStyle = city.color;
            ctx.fill();
            ctx.fillStyle = "white";
            ctx.fillText(city.name, position[0]+ rectSize /2.5, position[1] + rectSize / 2);
            ctx.strokeStyle = '#fff';
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            if(city.isCity){
                if(city.playerOwning){
                    ctx.fillText(city.tax + "€", position[0] + rectSize /2.5, position[1] + rectSize / 4);
                    ctx.rect(position[0], position[1], 5, 100);
                    ctx.rect(position[0]+ rectSize - 5, position[1], 5, 100);
                    ctx.fillStyle = city.playerOwning.color;
                    ctx.fill();
                } else {
                    ctx.fillText(city.price + "€", position[0] + rectSize /2.5, position[1] + rectSize / 4);
                }
            }
            ctx.closePath();


        
    });
}

function listenButtons(){
    document.getElementById("rollbtn").addEventListener("click", play);
    document.getElementById("buybtn").addEventListener("click", buyCity);
}


function rollDice(){
    var rollres = Math.round(Math.random() * (6 - 1) + 1);
    document.getElementById("rollres").style.background = "url(./assets/"+rollres+"dice.png)center/cover";

    return rollres;
}

function play(){
    var currentPlayer = players[whoplay];
    if(isInJail()){
        changePlayer();
    } else {
        var currentPlayer = players[whoplay];
        var roll = 7;
        if(currentPlayer.position + roll > mapSize){
            currentPlayer.position = currentPlayer.position + roll - mapSize;
        } else {
            currentPlayer.position = currentPlayer.position + roll;
        }
        players[whoplay] = currentPlayer;

        if(isOnOtherCity()){
            payPlayer();
        } else if(isOnJail()){
            goToJail();
        }
        
        refresh();

        if(!canBuyCity()){
            changePlayer();
        }
    }
}


function isInJail(){
    var currentPlayer = players[whoplay];
    console.log(currentPlayer);
    console.log(whoplay);
    return currentPlayer.jailTurn != 0;
}


function isOnOtherCity(){
    var currentPlayer = players[whoplay];
    var city = cities[currentPlayer.position-1];
    return (city.playerOwning != null && city.playerOwning != currentPlayer && city.isCity);
}

function isOnJail(){

    var currentPlayer = players[whoplay];
    var city = cities[currentPlayer.position-1];
    return city.position == 15;

}


function refresh(){
    uiShow();
    drawCities();
    drawPlayers();
}

function changePlayer(){
    whoplay++;
    whoplay = getPlayerTurn(whoplay);
    currentPlayer = players[whoplay];
    if(currentPlayer.jailTurn != 0){
        whoplay++;
        whoplay = getPlayerTurn(whoplay);
        currentPlayer.jailTurn--;
    }
}

function buyCity(){
    var currentPlayer = players[whoplay];
    var city = cities[currentPlayer.position-1];
    currentPlayer.money = currentPlayer.money - city.price;
    city.playerOwning = currentPlayer;

    var citiesMonopoly = getOtherMonopolyCitiesOwning
    if(getOtherMonopolyCities == citiesMonopoly){
        citiesMonopoly.forEach(city => {
            city.isMonopoly = true;
            city.sellValue = Math.round(city.sellValue + city.price * 0.8);
            city.price = Math.round(city.price / 1.5);
            city.tax = Math.round(city.sellValue / 3);
            
        });
    } else {
        city.tax = Math.round(city.sellValue / 3);
    }
    currentPlayer.cities.push(city);
    refresh();
    changePlayer();
    uiShow();
}


function canBuyCity(){
    var currentPlayer = players[whoplay];
    var city = cities[currentPlayer.position-1];
    return city.playerOwning == null && currentPlayer.money - city.price >= 0 && city.isCity;
}

function payPlayer(){
    var currentPlayer = players[whoplay];
    var city = cities[currentPlayer.position-1];

    currentPlayer.money = currentPlayer.money - city.tax;

    players[whoplay] = currentPlayer;

    city.playerOwning.money += city.tax;

    if(currentPlayer.money < bankrupt){
        alert("t'as perdu fdp");
    }
}

function goToJail(){
    var currentPlayer = players[whoplay];
    currentPlayer.jailTurn = 3;
    var inJailCount = 1;
    players.forEach(player => {
        if(player != currentPlayer && player.jailTurn != 0){
            inJailCount++;
        }
    });
    if(inJailCount == players.length){
        var isNotFinished = true;
        var i = 1;
        while(isNotFinished){
            var player = players[getPlayerTurn(whoplay + i - players.length)];
            player.jailTurn--;
            if(player.jailTurn == 0){
                isNotFinished = false;
            }
            i++;

            
            if(i != players.length){
                i = 1;
            }
            
        }
    }
}

function getPlayerTurn(turn){
    if (turn >= players.length || turn < 0){
        turn = 0;
    }
    return turn;
}

function getOtherMonopolyCities(){
    var currentPlayer = players[whoplay];
    var currentCity = cities[currentPlayer.position];
    var citiesMonopoly = new Array();
    cities.forEach(city => {
        if(city.color == currentCity.color){
            citiesMonopoly.push(city);
        }
    });
}

function getOtherMonopolyCitiesOwning(){
    var currentPlayer = players[whoplay];
    var currentCity = cities[currentPlayer.position];
    var citiesMonopoly = new Array();
    cities.forEach(city => {
        if(city.playerOwning == currentPlayer && city.color == currentCity.color){
            citiesMonopoly.push(city);
        }
    });
}


function getPosXY(pos){
    var position;

    if(pos >= 1 && pos <= mapLength){
        position = [0, canvas.clientWidth - pos * rectSize];

    } else if(pos > mapLength && pos < mapLength * 2){
        position = [pos * rectSize - canvas.clientWidth, 0];

    } else if(pos > mapLength * 2 - 1 && pos < mapLength * 3 - 1){
        position = [canvas.clientWidth-rectSize,  (pos * rectSize) - canvas.clientWidth * 2 + rectSize];

    } else {
        position = [canvas.clientWidth - ((pos * rectSize) - canvas.clientWidth * 3) - rectSize * 3, canvas.clientWidth - rectSize];
    }
    return position;
}


function uiShow(){
    uiDisplayScore();
    uiDisplayBuyBtn();
    uiDisplayRollBtn();
    uiDisplayTurn();
}

function uiDisplayScore() {
    document.getElementById("playerslist").innerHTML = '';
    players.forEach(player => {
        document.getElementById("playerslist").innerHTML += '<tr class="playerslist-row"><td>'+player.name+' :</td> <td>'+player.money+' €</td></tr>';
    });
}

function uiDisplayBuyBtn(){
    if(canBuyCity()){
        document.getElementById('buybtn').classList.remove('desactivate');
    } else {
        document.getElementById('buybtn').classList.add('desactivate');
    }
}

function uiDisplayRollBtn(){
    if(canBuyCity()){
        document.getElementById('rollbtn').classList.add('desactivate');
    } else {
        document.getElementById('rollbtn').classList.remove('desactivate');
    }
}

function uiDisplayTurn(){
    document.getElementById('turn').innerHTML = '<span>Turn :</span><span>'+players[whoplay].name+'</span><div style="width:2em; height: 2em; border-radius: 50%;background:'+players[whoplay].color+'"></div>';
    
}