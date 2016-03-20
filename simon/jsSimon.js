'use strict';
var gState = {
    seq: '',
    currTurn: {
        isUserTurn: false,
        playedNotesCount: 0
    }
};
var gSounds = {
    a: new Audio('sounds/ok.mp3'),
    b: new Audio('sounds/high_pitched_hello.mp3'),
    c: new Audio('sounds/girlhello.mp3'),
    d: new Audio('sounds/welcome.mp3'),
    e: new Audio('sounds/yes.mp3')
};
function extendSeq() {
    gState.seq += randomCharacter();
}
function randomCharacter() {
    var string = 'abcde';
    return string.substr(Math.floor(Math.random() * string.length), 1);
}
function playPressed(){
    gState.seq = '';
    playSeq();
}
function playSeq() {
    outputToUser('Listen to the sequence!!');
    extendSeq();
    gState.currTurn.isUserTurn = false;
    var intervalCounter = 0;
    setTimeout(function() {
        var intervalID = setInterval(function () {
            gSounds[gState.seq[intervalCounter]].play();
            addRemoveClass(gState.seq[intervalCounter]);
            console.log(gState.seq[intervalCounter]);
            intervalCounter++;
            if (intervalCounter === gState.seq.length) {
                userTurn();
                clearInterval(intervalID);
            }
        }, 1000);
        gState.currTurn.playedNotesCount = 0;
        gState.currTurn.isUserTurn = true;
    },1000);
}
function render() {
    var elContainer = document.querySelector('#container');
    var strHTML = '';
    for (var k in gSounds) {
        strHTML += '<div class= "note" id = note-'+k+' onclick="noteClicked(\'' + k + '\')"></div>';
        //id = note-'+k+'
    }
    elContainer.innerHTML = strHTML;
}
function noteClicked(note) {
    if (gState.currTurn.isUserTurn === false)return;
    addRemoveClass(note);
    if(gState.seq[gState.currTurn.playedNotesCount]!== note) {
        gState.currTurn.isUserTurn = false;
        return outputToUser('Wrong!! Press play to start again');
    }
    gState.currTurn.playedNotesCount += 1;
    gSounds[note].play();
    if(gState.currTurn.playedNotesCount === gState.seq.length) playSeq();
}
function userTurn(){
    gState.currTurn.isUserTurn = true;
    outputToUser('user turn');
}
function addRemoveClass(noteIndex){
    var elNote = document.querySelector('#note-'+noteIndex);
    console.log(elNote);
    elNote.classList.add('playing');
    setTimeout(function(){elNote.classList.remove('playing');}, 1000);
}
function outputToUser(txt){
    document.querySelector("#output").innerHTML = txt ;
}
render();
