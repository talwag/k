'use strict'

var gTracks;
var gRecents;

SC.initialize({
    client_id: '481fa42b193b17e654a022565712c958'
});

function search() {
    var strToSearch = document.querySelector('.search').value;
    addToRecent(strToSearch);
    SC.get('/tracks', {
        q: strToSearch, limit: 6, linked_partitioning: 1
    }).then(function (tracks) {
        addList(tracks);
    });
}
function loadMore() {
    var request = new XMLHttpRequest();
    request.open('GET', gTracks.next_href, true);
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            var data = JSON.parse(request.responseText);
            addList(data);
        } else {
            console.log('target server returned an error');
        }
    };
    request.onerror = function () {
        console.log('There was a connection error of some sort');
    };
    request.send();
}

function addList(tracks) {
    gTracks = tracks;
    var lis = gTracks.collection.map(function (track, i) {
        return '<li  class="animated" onclick="selectTrack(this,' + i + ')">' + track.title + '</li>';
    });
    var elLi = document.querySelector('.results');
    elLi.innerHTML = lis.join('\n');
}

function addToRecent(strToSearch) {
    var strHTML = '';
    loadRecents();
    if (strToSearch) {
        gRecents.unshift(strToSearch);
        if (gRecents.length > 5) gRecents.pop();
    }
    gRecents.forEach(function (recent) {
        strHTML += '<li onclick="putInSearch(this)">' + recent + '</li>';
    });
    document.querySelector('.recent').innerHTML = strHTML;
    saveRecents();
}

function saveRecents() {
    localStorage['recents'] = JSON.stringify(gRecents);
}

function loadRecents() {
    if (localStorage['recents']) gRecents = JSON.parse(localStorage['recents']);
    else gRecents = [];

}

function putInSearch(el) {
    var strToSearch = el.innerText;
    document.querySelector('.search').value = strToSearch;
    search();
}

function selectTrack(el, index) {
    var alreadyFade = document.querySelector('.fadeOutRight');
    if (alreadyFade) alreadyFade.classList.remove('fadeOutRight');
    el.classList.add('fadeOutRight');

    var elImg = document.querySelector('.img-container');
    if (elImg.classList.contains('fadeIn')) elImg.classList.remove('fadeIn');
    setInterval(function () {
        elImg.classList.add('fadeIn');
    }, 1);
    getImage(elImg, index);
}

function getImage(elImg, index) {
    if (gTracks.collection[index].artwork_url) {
        elImg.innerHTML = '<img class="img" onclick="playTrack(' + index + ')" src="' + gTracks.collection[index].artwork_url + '">'
    } else {
        elImg.innerHTML = '<img class="img" onclick="playTrack(' + index + ')" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/100px-No_image_available.svg.png">';
    }
}

function playTrack(index) {
    SC.stream('/tracks/' + gTracks.collection[index].id).then(function (player) {
        player.play();
    });
}