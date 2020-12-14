var arr = [[], [], [], [], [], [], [], [], []]  // 
var temp = [[], [], [], [], [], [], [], [], []]
// creating variables
var timer;
var timerem;
var lives;
var selectednum;
var selectedtile;
var disableselect;

for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
        arr[i][j] = document.getElementById(i * 9 + j);

    }
}

function initializeTemp(temp) {

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            temp[i][j] = false;

        }
    }
}

function setTemp(board, temp) {

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (board[i][j] != 0) {
                temp[i][j] = true;
            }

        }
    }
}


function setColor(temp) {

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (temp[i][j] == true) {
                arr[i][j].style.color = "#DC3545";
            }

        }
    }
}

function resetColor() {

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            arr[i][j].style.color = "green";
        }
    }
}

var board = [[], [], [], [], [], [], [], [], []]
let button = document.getElementById('generate-sudoku')
let solve = document.getElementById('solve')

console.log(arr)

function changeBoard(board) {
    // console.log(board[0][3]);
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (board[i][j] != 0) {

                arr[i][j].innerText = board[i][j];

            }
            else {
                arr[i][j].innerText = '';
            }
        }
    }
}

function id(id) {
    return document.getElementById(id);
}

function startingfun() {
    startgame();
    // add eventlistener to each num in numbers
    for (let i =0; i<id("numbers").children.length; i++) {
        id("numbers").children[i].addEventListener("click", function () {
            // if selecting is not disabled
            if(!disableselect) {
                // if num is already selected
                if (this.classList.contains("selected")) {
                    // then remove selection
                    this.classList.remove("selected");
                    selectednum = null;
                }
                else {
                    // deselect all other num
                    for (let i =0 ; i<9; i++) {
                        id("numbers").children[i].classList.remove("selected");
                    }
                    // select it and update selectednum variable
                    this.classList.add("selected");
                    selectednum = this;
                    updatemove();
                }
            }
        });
    }    
}

function startgame() {  

    lives = 3;
    disableselect = false;
    id("lives").textContent = "Lives Remaining: 3";
    // clear prev board if any
    clearprev();
    // start the timer
    startTimer();
    // sets theme based on input
    if(id("theme-1").checked) {
        document.body.classList.remove("dark");
    }
    else {
        document.body.classList.add("dark");
    }
    // show numbers
    id("numbers").classList.remove("hidden"); 
}

function startTimer() {

    // sets time remaining based on input
    if(id("time-1").checked) timeRemaining = 180;
    else if (id("time-2").checked) timeRemaining = 300;
    else timeRemaining = 600;
    
    // sets timer for first sec
    id("timer").textContent = timeConversion(timeRemaining);
    
    // sets timer to update every sec (loop)
    timer = setInterval(function() {
        timeRemaining--;
        
        // if no time remaining end the game
        if(timeRemaining === 0) endGame();
        
        id("timer").textContent = timeConversion(timeRemaining);
    },1000)        // 1000 will run the function in every 1000 millisec
}

// converts sec into string MM:SS format
function timeConversion(time) {
    let minutes = Math.floor(time/60);
    if(minutes < 10) minutes = "0"+minutes;
    let seconds = time%60;
    if(seconds < 10) seconds = "0"+seconds;
    return minutes+":"+seconds;
}


function updatemove() {
    // if a tile and a number is selected
    if (selectedtile && selectednum) {
        // set the tile to the correct num
        selectedtile.textContent = selectednum.textContent;
        
        // if the num matches the corrsponding num in soln key
        if (checkcorect(selectedtile)) {
            // deselect the tiles
            selectedtile.classList.remove("selected");
            selectednum.classList.remove("selected");
            // clear the selected variables
            selectednum = null;
            selectedtile = null;

            // check if board is completed
            if(checkdone()){
                endGame();
            }

        } // if the num does not match the soln key
        else {
            
            // disable selecting new num for one sec
            disableselect = true;
            // make the tile red
            selectedtile.classList.add("incorrect");
            // run in one sec
            setTimeout (function() {
                // subtract lives by one 
                lives--;
                // if no lives left end the game
                if (lives === 0) { 
                    endGame();
                }
                else {
                    // update lives text
                    id("lives").textContent = "Lives Remaining: " + lives;
                    // renable selecting num and tiles
                    disableselect = false;
                }
                // restore tile color and remove selected from both
                selectedtile.classList.remove("incorrect");
                selectedtile.classList.remove("selected");
                selectednum.classList.remove("selected");
                // clear the tiles text and clear selected variables
                selectedtile.textContent = "";
                selectedtile = null;
                selectednum = null;
            }, 1000);
        }
    }
}

function checkcorect(tile) {
    // tile is element

    // Check if tile's num is equal to solution's number
    // find the correct array pos of selected tile
    var i = Math.floor(tile.id/9);      // row pos
    var j = tile.id%9;                  // coln pos

    // Check if the tile's num can be placed at selected pos
    // sending the current board, coordinates where the val can be placed and obviously the num 
    if (isPossible(board,i,j,tile.textContent)) return true;
    else return false;

}


function checkdone() {
    // if the board is already filled or not
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (arr[i][j].innerText === 0) {
                return false;
            }
        }
    }
    // return true;
}

function endGame() {
    // disable moves and stop timer
    disableselect = true;
    clearTimeout(timer);
    // display win or loss
    if (lives === 0 || timeRemaining === 0 ) {
        id("lives").textContent = "You Lost!";
    }
    else {
        id("lives").textContent = "You Won!";
    }
}

function clearprev() {

    // if there is timer clear it
    if(timer) clearTimeout(timer); 
    // deselect all num in case if anyone is selected
    for (let i = 0; i < id("numbers").children.length; i++) {
        id("numbers").children[i].classList.remove("selected");
    }
    // clear selected variables
    selectedtile = null;
    selectednum = null;
}

function selectingfun(board) {

    for (let i =0; i<id("container").children.length; i++) {
        id("container").children[i].addEventListener("click", function () {
            
            if(!disableselect) {
                // if the tile is already selected
                if (this.classList.contains("selected")) {
                    // remove selection
                    this.classList.remove("selected");
                    selectedtile = null;
                }
                else {
                    // deselect all other tile 
                    for (let i = 0; i< 81; i++) {
                        id("container").children[i].classList.remove("selected");
                    }

                    // add selection and update variable
                    this.classList.add("selected");
                    selectedtile = this;
                    // console.log(ss);
                    updatemove();
                }
            }
        });
    }
}

button.onclick = function () {      // main func to setup board

    startingfun();

    // Working of AJAX and JSON
    // To send an HTTP request, create an XMLHttpRequest object(1), open a URL(2), and send the 
    // request(3). After the transaction completes, the object will contain useful information 
    // such as the response body and the HTTP status of the result.

    var xhrRequest = new XMLHttpRequest()   // request data from server(1)
    // XMLHttpRequest.onload is the function called when an XMLHttpRequest
    // transaction completes successfully.
    xhrRequest.onload = function () {       // (4)

        // A common use of JSON is to exchange data to/from a web server.
        // When receiving data from a web server, the data is always a string.
        // Parse the data with JSON.parse(), and the data becomes a JavaScript object.
        var response = JSON.parse(xhrRequest.response) 
        console.log(response)   // response is board
        initializeTemp(temp)    // initialise all box to false
        resetColor()            // makes all box green

        board = response.board      // it is our matrix from the URL site
        setTemp(board, temp)   // it sets all box to true which are filled
        setColor(temp)      // sets color red to all filled boxes
        changeBoard(board)  // it basically fills the values in main board from board matrix

        selectingfun(board);
    }

    // To send a request to a server, we use the open()(2) and send()(3) 
    // methods of the XMLHttpRequest object
    xhrRequest.open('get', 'https://sugoku.herokuapp.com/board?difficulty=easy')
    // we can change the difficulty of the puzzle the allowed values of difficulty 
    // are easy, medium, hard and random
    xhrRequest.send()    
}


// Check if the val can be placed at a specific pos (board[sr][sc])
function isPossible(board, sr, sc, val) {
    // checking in row
    for (var row = 0; row < 9; row++) {
        if (board[row][sc] == val) {
            return false;
        }
    }
    // checking in coln
    for (var col = 0; col < 9; col++) {
        if (board[sr][col] == val) {
            return false;
        }
    }
    var r = sr - sr % 3;
    var c = sc - sc % 3;
    // checking in square
    for (var cr = r; cr < r + 3; cr++) {
        for (var cc = c; cc < c + 3; cc++) {
            if (board[cr][cc] == val) {
                return false;
            }
        }
    }
    return true;
}

// Main Algo to solve sudoku
function solveSudokuHelper(board, sr, sc) {
    if (sr == 9) {
        changeBoard(board);
        return;
    }
    if (sc == 9) {
        solveSudokuHelper(board, sr + 1, 0)
        return;
    }

    if (board[sr][sc] != 0) {
        solveSudokuHelper(board, sr, sc + 1);
        return;
    }

    for (var i = 1; i <= 9; i++) {
        if (isPossible(board, sr, sc, i)) {
            board[sr][sc] = i;
            solveSudokuHelper(board, sr, sc + 1);
            board[sr][sc] = 0;
        }
    }
}

function solveSudoku(board) {
    solveSudokuHelper(board, 0, 0)
}

solve.onclick = function () {
    solveSudoku(board)
    endGame();   
}