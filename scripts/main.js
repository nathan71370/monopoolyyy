//Const
const playerObject = {
    name : null,
    color : null,
    position : 1,
    money : null,
    cities : null,
    jailTurn : 0,
}

const cityObject = {
    name : null,
    sellValue : null,
    price : null,
    tax : null,
    basePrice : null,
    color : null,
    position : null,
    playerOwning : null,
    upgradeLeft : 3,
    isMonopoly : false,
    isCity : null,
}

//variables
let mapLength = 8;
let rectSize = 100;
let moneyBase = 1000;
let moneyToWin = 7000;
let jailTurn = 3;
let mapSize = mapLength * 4 - 4;
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let bankrupt = -500;
let salary = 200;
let amountWeGetPerTrade = 100;
let colors = ["red", "yellow", "blue", "green"];

var cities = new Array();
var players = new Array();

var gameEnded = false;

var whoplay = 0;

var playerHasRoll = false;

//TODO : put this in a button
document.getElementById("startGameBtn").addEventListener("click", startGame);

/**
 * Start the game
 */
function startGame(){
    document.getElementById("startGameBtn").classList.add('desactivate');
    document.getElementById("close-stats-ui").classList.add('desactivate');
    initBoard();
    createPlayer("Charles");
    createPlayer("Nathan");
    createPlayer("Gal Gadot");
    createPlayer("Kendall Jenner");
    drawPlayers();
    uiShow();
    drawUI();
}

/**
 * Initialisation of the board
 */
function initBoard(){
    initCities();
    drawCities();
    listenButtons();
}

/**
 * Initialize all cities
 */
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
    createCity("SEOUL", 200, "darkorange", 13, true);
    createCity("SOWETO", 200, "darkorange", 14, true);
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


/**
 * Create a city and add it to the city array
 * @param {cityName} name 
 * @param {cityPrice} price 
 * @param {cityColor} color 
 * @param {cityPosition} position 
 * @param {isCity} isCity 
 */
function createCity(name, price, color, position, isCity) {
    city = Object.create(cityObject);
    city.name = name;
    city.price = price;
    city.color = color;
    city.position = position;
    city.basePrice = price;
    city.tax = Math.round(city.price / 3);
    city.sellValue = price * 0.8;
    if(isCity != undefined){
        city.isCity = isCity;
    }
    cities.push(city);
}

/**
 * Create a player and add it to the player array
 * @param {playerName} name 
 */
function createPlayer(name){
    var player = Object.create(playerObject);
    player.name = name;
    player.color = colors[players.length];
    player.money = moneyBase + players.length * 50;
    player.cities = new Array;
    players.push(player);
}

/**
 * Draw each players
 */
function drawPlayers(){
    players.forEach(player => {
        var position = getPosXY(player.position);
        ctx.beginPath();
        ctx.arc(position[0] + canvas.clientWidth / 40 * players.indexOf(player) + rectSize/5, position[1] + canvas.clientWidth / 10, 10, 0, Math.PI*2, false);
        ctx.fillStyle = player.color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.stroke();
        ctx.closePath();
    });
}

/**
 * Draw each cities
 */
function drawCities(){
    
    cities.forEach(city => {
        var position = getPosXY(city.position);
        ctx.beginPath();
        ctx.rect(position[0], position[1], rectSize, rectSize);
        ctx.fillStyle = "#DCDCDC";
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.rect(position[0], position[1], 100, 30);
        ctx.fillStyle = city.color;
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.fillStyle = "#000";
        ctx.font = "2em Arial";
        ctx.font = "bolder 0.9em Arial";
        ctx.textAlign = "center";
        ctx.fillText(city.name, position[0]+ 50, position[1] + 20);
        ctx.closePath();

        ctx.beginPath();
        if(city.isCity){
            if(city.playerOwning){
                ctx.textAlign = "center";
                ctx.fillText('↗ ' + city.tax + ' €', position[0]+ 50, position[1] + 50);
                //ctx.fillText(city.tax + "€", position[0] + rectSize /2.5, position[1] + rectSize / 4);
                ctx.rect(position[0], position[1], 5, 100);
                ctx.rect(position[0]+ rectSize - 5, position[1], 5, 100);
                ctx.fillStyle = city.playerOwning.color;
                ctx.fill();
            } else {
                ctx.fillStyle = "#000";
                ctx.textAlign = "center";
                ctx.fillText(city.price + "€", position[0]+ 50, position[1] + 50);
                //ctx.fillText(city.price + "€", position[0] + rectSize /2.5, position[1] + rectSize / 2);
            }
        } else {
            ctx.beginPath();
            // var img = document.getElementById("bonus-img");
            // ctx.drawImage(img, 100, 100);
            ctx.rect(position[0], position[1], rectSize, rectSize);
            ctx.fillStyle = city.color;
            ctx.fill();
            ctx.fillStyle = "#fff";
            ctx.font = "2em Arial";
            ctx.font = "bolder 0.9em Arial";
            ctx.textAlign = "center";
            ctx.fillText(city.name, position[0]+ 50, position[1] + 50);
            ctx.closePath();

        }
        ctx.closePath();

        ctx.beginPath();
        ctx.rect(position[0], position[1], rectSize, rectSize);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

    });
}

/**
 * Listen to HTML buttons
 */
function listenButtons(){
    document.getElementById("rollbtn").addEventListener("click", play);
    document.getElementById("buybtn").addEventListener("click", buyCity);
    document.getElementById("passbtn").addEventListener("click", changePlayer);
    document.getElementById("close-stats-ui").addEventListener("click", refresh);
}

/**
 * Return a random number between 1 and 6
 * @returns random between 1 and 6
 */
function rollDice(){
    var rollres = Math.round(Math.random() * (6 - 1) + 1);
    document.getElementById("rollres").style.background = "url(./assets/"+rollres+"dice.png)center/cover";

    return rollres;
}

/**
 * Make player roll dice and move, also checking the city he lands on
 */
function play(){
    playerHasRoll = true;
    var playerHasBankrupt = false;
    var currentPlayer = players[whoplay];
    if(isInJail()){
        changePlayer();
    } else {
        var roll = rollDice();
        if(currentPlayer.position + roll > mapSize){
            currentPlayer.position = currentPlayer.position + roll - mapSize;
            currentPlayer = sendOrRemoveMoneyToPlayer(currentPlayer, salary);
        } else {
            currentPlayer.position = currentPlayer.position + roll;
        }

        if(isOnOtherCity()){
            payPlayer();
        } else if(isOnJail()){
            goToJail();
        } else if(isOnLuck()){
            getLuckCard();
        }
        if(isBankrupt()){
            players.splice(players.indexOf(currentPlayer), 1);
            alert("Vous avez fait faillite !");
            playerHasBankrupt = true; 
        }
        if(isThereAWinner()){
            gameEnded = true;
        }
        if(isGameEnded() || gameEnded){
            var winner = players[0];
            gameEnded = true;
            whoplay = 0;
            alert("Partie terminée, " + winner.name + " à gagné avec " + winner.money + "€ !")
        } else {
            if(!canBuyCity() && !playerHasBankrupt){
                changePlayer();
            }
        }
    }
    refresh();
    playerHasRoll = false;
}


/**
 * Sell a city
 */
function sellCity(cityPos){
    var city = getCityFromPosition(cityPos);
    var player = city.playerOwning;

    player.cities.splice(player.cities.indexOf(city), 1);

    player.money += city.sellValue;

    city.sellValue = city.basePrice;
    city.price = city.basePrice;
    city.tax = Math.round(city.basePrice / 3);

    city.playerOwning = null;

    cities[cities.indexOf(city)] = city;
}

/**
 * If player land on the trade boardgame square, go in this function
 */
function trade(city1Pos, city2Pos){
    var city1 = getCityFromPosition(city1Pos);
    var city2 = getCityFromPosition(city2Pos);

    var player1 = city1.playerOwning;
    var player2 = city2.playerOwning;

    player1.money += amountWeGetPerTrade;
    player2.money += amountWeGetPerTrade;

    player1.cities.splice(player1.cities.indexOf(city1), 1);
    city1.playerOwning = player2;
    player1.cities.push(city2);

    player2.cities.splice(player2.cities.indexOf(city2), 1);
    city2.playerOwning = player1;
    player2.cities.push(city1);

    //saving changes
    cities[city1.position-1] = city1;
    cities[city2.position-1] = city2;

    players[players.indexOf(player1)] = player1;
    players[players.indexOf(player2)] = player2;
}

/**
 * Get city from position
 * @param {position} position 
 * @returns 
 */
function getCityFromPosition(position){
    let city = cities[position];
    return city;
}

/**
 * Check if a player is above moneyToWin
 * @returns true or false
 */
function isThereAWinner(){
    var winner = false;
    players.forEach(player => {
        if(player.money >= moneyToWin){
            winner =  true;
        }
    });
    return winner;
}

/**
 * Check if game ended
 * @returns true or false;
 */
function isGameEnded(){
    return players.length == 1 || gameEnded;
}

/**
 * Check if a player is bankrupt
 */
function isBankrupt(){
    var currentPlayer = players[whoplay];
    return (currentPlayer.money < bankrupt);
}


/**
 * Check if the current player is in jail
 * @returns true or false
 */
function isInJail(){
    var currentPlayer = players[whoplay];
    return currentPlayer.jailTurn != 0;
}

/**
 * Check if the current player is on another city
 * @returns true or false
 */
function isOnOtherCity(){
    var currentPlayer = players[whoplay];
    var city = cities[currentPlayer.position-1];
    return (city.playerOwning != null && city.playerOwning != currentPlayer && city.isCity);
}

/**
 * Check if the player is on the jail boardSquare
 * @returns true or false
 */
function isOnJail(){
    var currentPlayer = players[whoplay];
    var city = cities[currentPlayer.position-1];
    return city.position == 15;
}

/**
 * Check if the player is on the Luck boardSquare
 * @returns true or false
 */
function isOnLuck(){
    var currentPlayer = players[whoplay];
    var city = cities[currentPlayer.position-1];
    return city.position == 8;
}

function getLuckCard(){
    var chance = Math.random();
    var money;

    // 50% chance of being here
    if (chance < 0.5){
        money = - 100;
    // 30% chance of being here
    } else if (chance < 0.8){
        money = 100;
    // 15% chance of being here
    } else if(chance < 0.95){
        money = 200;
    // 5% chance of being here
    } else {
        money = 300;
    }

    players[whoplay] = sendOrRemoveMoneyToPlayer(players[whoplay], money);
}


/**
 * Give a certain amount to the given player (amount can be negative)
 * @param {receiver} player 
 * @param {amount} amount 
 */
function sendOrRemoveMoneyToPlayer(player, amount){
    player.money += amount;
    return player;
}

/**
 * Check if the player is on the trade boardSquare
 * @returns true or false
 */
 function isOnTrade(){
    var currentPlayer = players[whoplay];
    var city = cities[currentPlayer.position-1];
    return city.position == 22;
}

/**
 * Refresh all the ui
 */
function refresh(){
    uiShow();
    drawCities();
    drawPlayers();
    drawUI();
    document.getElementById("close-stats-ui").classList.add('desactivate');
}

/**
 * Change turn of a player and go to the next one
 */
function changePlayer(){
    whoplay++;
    whoplay = getPlayerTurn(whoplay);
    currentPlayer = players[whoplay];
    if(currentPlayer.jailTurn != 0){
        currentPlayer.jailTurn--;
        if(currentPlayer.jailTurn != 0){
            whoplay++;
            whoplay = getPlayerTurn(whoplay);
        }
    }
    refresh();
}

/**
 * Allow the current player to buy the city he lands on or upgrade it
 */
function buyCity(){
    var currentPlayer = players[whoplay];
    var city = cities[currentPlayer.position-1];

    currentPlayer = sendOrRemoveMoneyToPlayer(currentPlayer, -city.price);

    if(canUpgradeCity()){
        city.sellValue = Math.round(city.sellValue + city.price * 0.8);
        city.tax = Math.round(city.sellValue / 3);
        city.upgradeLeft--;
    } else {
        city.playerOwning = currentPlayer;
        var citiesMonopoly = getOtherMonopolyCitiesOwning();
        console.log(citiesMonopoly);
        if(getOtherMonopolyCities().length == citiesMonopoly.length){
            citiesMonopoly.forEach(city => {
                city.isMonopoly = true;
                city.sellValue = Math.round(city.sellValue + city.price * 0.8);
                city.price = Math.round(city.price / 1.5);
                city.tax = Math.round(city.sellValue / 3);
                
            });
            alert('Monopoolyyy');
        } else {
            city.tax = Math.round(city.sellValue / 3);
        }
        currentPlayer.cities.push(city);
        changePlayer();
    }
    refresh();
    uiShow();
    drawUI()
}


/**
 * Check if the player can buy the city / an upgrade
 * @returns true or false
 */
function canBuyCity(){
    var currentPlayer = players[whoplay];
    var city = cities[currentPlayer.position-1];
    return (city.playerOwning == null && currentPlayer.money - city.price >= 0 && city.isCity && playerHasRoll);
}


function canUpgradeCity(){
    var currentPlayer = players[whoplay];
    var city = cities[currentPlayer.position-1];
    return (city.isMonopoly && city.playerOwning == currentPlayer && city.upgradeLeft != 0);
}

/**
 * Pay the player the tax of the city he lands on
 */
function payPlayer(){
    var currentPlayer = players[whoplay];
    var city = cities[currentPlayer.position-1];

    players[whoplay] = sendOrRemoveMoneyToPlayer(currentPlayer, -city.tax);

    city.playerOwning.money += city.tax;
}

/**
 * Put a player in jail (by incrementing the jailTurn of the player)
 */
function goToJail(){
    var currentPlayer = players[whoplay];
    currentPlayer.jailTurn = jailTurn;

    let inJailCount = getNumberOfPlayersInJail();
    
    //If every players are in jail, we skip the turn automatically until a player gets out
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

/**
 * Get the number of players currently in jail
 * @returns number of players in jail
 */
function getNumberOfPlayersInJail(){
    var inJailCount = 1;

    //checking the number of player in jail
    players.forEach(player => {
        if(player != currentPlayer && player.jailTurn != 0){
            inJailCount++;
        }
    });
    return inJailCount;
}

/**
 * Get the player turn
 * @param {playerTurn} turn 
 * @returns the player actual turn
 */
function getPlayerTurn(turn){

    //if the turn is above players.lenght, we put it back to 0
    if (turn >= players.length || turn < 0){
        turn = 0;
    }
    return turn;
}

/**
 * Get all the other same color cities
 */
function getOtherMonopolyCities(){
    var currentPlayer = players[whoplay];
    var currentCity = cities[currentPlayer.position-1];
    var citiesMonopoly = new Array();
    cities.forEach(city => {
        if(city.color == currentCity.color){
            citiesMonopoly.push(city);
        }
    });
    return citiesMonopoly;
}

/**
 * Get all the other same color cities that the current player own
 */
function getOtherMonopolyCitiesOwning(){
    var currentPlayer = players[whoplay];
    var currentCity = cities[currentPlayer.position-1];
    var citiesMonopoly = new Array();
    cities.forEach(city => {
        if(city.playerOwning == currentPlayer && city.color == currentCity.color){
            citiesMonopoly.push(city);
        }
    });
    return citiesMonopoly;
}



/**
 * Get XY from given index
 * @param {position} pos 
 * @returns XY position
 */
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

/**
 * Show/ refresh UI (innetHTML)
 */
function uiShow(){
    uiDisplayScore();
    uiDisplayBuyBtn();
    uiDisplayRollBtn();

    players.forEach(player => {

        uiListenBtnPlayerInfo(player);
    });
}

/**
 * Display score
 */
function uiDisplayScore() {
    document.getElementById("playerslist").innerHTML = '';
    players.forEach(player => {
        document.getElementById("playerslist").innerHTML += '<div id="player-num-'+ player.name +'" class="player-container" style="background:'+player.color+'"><div id="player-container-text"><span>'+player.name+' :</span> <span>'+player.money+' €</span></div></div>';
        if(players[whoplay] == player){
            document.getElementById('player-num-'+player.name).classList.add('player-turn');
        }
    });
    
}

/**
 * Display buy button
 */
function uiDisplayBuyBtn(){
    if((canBuyCity() || canUpgradeCity()) && !isGameEnded()){
        document.getElementById('buybtn').classList.remove('desactivate');
        document.getElementById('passbtn').classList.remove('desactivate');
    } else {
        document.getElementById('buybtn').classList.add('desactivate');
        document.getElementById('passbtn').classList.add('desactivate');
    }
}

/**
 * Display roll button
 */
function uiDisplayRollBtn(){
    if(canBuyCity() || isGameEnded()){
        document.getElementById('rollbtn').classList.add('desactivate');
        document.getElementById('rollres').classList.remove('desactivate');
    } else {
        document.getElementById('rollbtn').classList.remove('desactivate');
        document.getElementById('rollres').classList.add('desactivate');
    }
}


function uiListenBtnPlayerInfo(player) {
    document.getElementById("player-num-"+player.name).addEventListener("click", ()=>  {
        playerStatsUI(player);
    });
}

function drawUI() {
    ctx.beginPath();
    ctx.rect(106, 106, 588, 588);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(112, 112, 288, 288);
    ctx.fillStyle = "#DCDCDC";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(410, 112, 278, 288);
    ctx.fillStyle = "#DCDCDC";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(112, 410, 288, 278);
    ctx.fillStyle = "#DCDCDC";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(410, 410, 278, 278);
    ctx.fillStyle = "#DCDCDC";
    ctx.fill();
    ctx.closePath();

    players.forEach((player, index) => {
        ctx.beginPath();
        ctx.fillStyle = "#000";
        ctx.font = "2em Arial";
        ctx.font = "bolder .9em Arial";
        switch (index) {
            case 0:
                ctx.textAlign = "left";
                ctx.fillText(player.name, 132, 142);
                ctx.fillText(player.money + ' €', 132, 162);
                ctx.font = ".8em Arial";
                player.cities.forEach((city, i) =>  ctx.fillText(city.name, 132, 182  + 15 * i))
            break;
            case 1:
                ctx.textAlign = "left";
                ctx.fillText(player.name, 430, 142);
                ctx.fillText(player.money + ' €', 430, 162);
                ctx.font = ".8em Arial";
                player.cities.forEach((city, i) =>  ctx.fillText(city.name, 430, 182 + 15 * i))
            break;
            case 2:
                ctx.textAlign = "left";
                ctx.fillText(player.name, 132, 440);
                ctx.fillText(player.money + ' €', 132, 460);
                ctx.font = ".8em Arial";
                player.cities.forEach((city, i) =>  ctx.fillText(city.name, 132, 480 + 15 * i))
            break;
            case 3:
                ctx.textAlign = "left";
                ctx.fillText(player.name, 430, 440);
                ctx.fillText(player.money + ' €', 430, 460);
                ctx.font = ".8em Arial";
                player.cities.forEach((city, i) =>  ctx.fillText(city.name, 430, 480 + 15 * i))
            break;
        }
        
        ctx.closePath();
    });

    
}

function playerStatsUI(player) {
    const path = new Path2D()
    path.rect(200, 200, 400, 400)
    path.closePath()

    ctx.fillStyle = "rgba(0,0,0,1)"
    ctx.fill(path)
    ctx.lineWidth = 2
    ctx.strokeStyle = "#fff"
    ctx.stroke(path)

    ctx.beginPath();
    ctx.font = "1.2em Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(player.name, 220, 230);
    ctx.fillText('Money : ' + player.money + ' €', 220, 250);
    
    player.cities.forEach((city, index) =>  {
        ctx.fillStyle = city.color;
        ctx.font = "0.9em Arial";
        ctx.fillText(city.name + ' ( Tax: ' + city.tax + ' € Sell Value: '+ city.sellValue +' €)', 220, 270 + index*20)
    })
    ctx.fill();
    ctx.closePath();

    document.getElementById("close-stats-ui").classList.remove('desactivate');
}
