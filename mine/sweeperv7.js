'use strict';
var gMinesNum = 10;
var gBoardSize = 9;
var EMPTY;
var MINE = '*';
var gIntervalSecs;
var gFlagCounter = 0;
var gIsFirstClick = true;

function createBoard(size, minesNum) {
    var board = [];
    for (var i = 0; i < size; i++) {
        var row = [];
        for (var j = 0; j < size; j++) {
            row.push(EMPTY);
        }
        board.push(row);
    }
    gFlagCounter = 0;
    setMines(gMinesNum, board);
    return board;
}

function setMines(minesNum, board) {
    for (var i = 0; i < minesNum; i++) {
        var iMine = Math.floor((Math.random() * (board.length - 1)) + 1);
        var jMine = Math.floor((Math.random() * (board.length - 1)) + 1);
        if(board[iMine][jMine] === MINE) i-- ;
        else board[iMine][jMine] = MINE;
    }
}

function setMinesNegsCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j];
            var mineNegsCount = 0;

            for (var ii = -1; ii <= 1; ii++) {
                for (var jj = -1; jj <= 1; jj++) {
                    var currI = i + ii;
                    var currJ = j + jj;

                    if (ii === 0 && jj === 0) continue;
                    if (currI < 0 || currI >= gBoard.length) continue;
                    if (currJ < 0 || currJ >= gBoard[0].length) continue;
                    if (gBoard[currI][currJ] === MINE) {
                        mineNegsCount++;
                    }
                }
            }
            if (gBoard[i][j] !== MINE) gBoard[i][j] = mineNegsCount;
        }
    }
    renderBoard();
}

function renderBoard() {
    gIsFirstClick = true;
    var elTableBody = document.querySelector('#tableBody');
    var strHTML = '';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < gBoard[0].length; j++) {
            strHTML += '<td class = "hide" id = "cell' + i + '-' + j + '"onclick="cellClicked(this,' + i + ',' + j + ');' +
            '" oncontextmenu="handleRightClick(this); return false;"></td>';
        }
    }
    elTableBody.innerHTML = strHTML;
    flagsCount();
}

function handleRightClick(elCell) {
    
    if (elCell.classList.contains('flag')) {        
        elCell.classList.remove('flag');
        elCell.classList.add('hide');
        gFlagCounter--;
        flagsCount();
    } else if (gFlagCounter < gMinesNum && elCell.classList.contains('hide')) {
        elCell.classList.add('flag');
        gFlagCounter++;
        flagsCount()
    }
}
function flagsCount() {
    var elBombsToGo = (document.querySelector('.bombsToGo'));
    elBombsToGo.innerHTML = gMinesNum-gFlagCounter;
}

function cellClicked(elCell, i, j) {
    if(gIsFirstClick) {
        timeCounter();
        gIsFirstClick = false;
    }
    if(!(elCell.classList.contains('flag'))) {
        elCell.innerHTML = gBoard[i][j];
        elCell.classList.remove('hide');
        if (gBoard[i][j] === 0) return expandShown(elCell, i, j);
        else if ((gBoard[i][j] === MINE)) {
            gameLost();
        }
        else if (isGameWon()) {
            alert(' You are such a winner!!');
            (document.querySelector('.bombsToGo')).innerHTML = 0;
            gameEnded();
        }
    }
}

function expandShown(elCell, i, j) {
    var elCurrentCell;
    for (var ii = -1; ii <= 1; ii++) {
        for (var jj = -1; jj <= 1; jj++) {
            var currI = i + ii;
            var currJ = j + jj;
            elCurrentCell = document.querySelector("#cell" + currI + "-" + currJ);

            if (ii === 0 && jj === 0) continue;
            if (currI < 0 || currI >= gBoard[0].length) continue;
            if (currJ < 0 || currJ >= gBoard[0].length) continue;
            if (elCurrentCell.innerHTML != '') continue;
            if (gBoard[currI][currJ] !== MINE && (!(elCurrentCell.classList.contains('flag')))) {
                elCurrentCell.classList.remove('hide');
                elCurrentCell.innerHTML = gBoard[currI][currJ];
                if(gBoard[currI][currJ] == 0) expandShown(elCurrentCell, currI, currJ);
            }
        }
    }
}
function timeCounter() {
    clearInterval(gIntervalSecs);
    var time = 0;
    var elSecs = document.querySelector('.secs');
    gIntervalSecs = setInterval(function () {
        time += 1;
        time = parseFloat(time.toFixed(2));
        elSecs.innerHTML = time;
    }, 1000);
}
function gameLost() {
    var elCurrentCell;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j] === MINE) {
                elCurrentCell = document.querySelector("#cell" + i + "-" + j);
                elCurrentCell.innerHTML = gBoard[i][j];
            }
        }
    }
    alert('Boom!!!!! Game over!');
    gameEnded();
    clearInterval(gIntervalSecs);


}
function gameEnded() {
    if (confirm('Do you want to play again?')) {
        gBoard = createBoard(gBoardSize, gMinesNum);
        setMinesNegsCount();

    }
}
function isGameWon() {
    var gameWon = true;
    var elCell;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            elCell = document.querySelector("#cell" + i + "-" + j);
            if (elCell.classList.contains('hide') && gBoard[i][j] !== MINE)  gameWon = false;
        }
    }
    return gameWon;
}

function level(boardSize, minesNum){
    gBoardSize = boardSize;
    gMinesNum = minesNum;
    gBoard = createBoard(gBoardSize);
    setMinesNegsCount();
}

var gBoard = createBoard(gBoardSize);
setMinesNegsCount();

