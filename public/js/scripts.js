var socket = io();

var apiKey = 'AIzaSyDKjZKBuDuPdqgpNZmqby6-iqKTJ66W8JU';
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;
var primeraVez = true;
// var duracionMin = 120;
// var duracionMax = 420;
var duracionMin = 1;
var duracionMax = 4200000000;

function fetchFunc(endpoint,response){
  fetch(endpoint)
    .then(function(response) {
      return response.json();
    }).then(function(json) {
      response(json)
    }).catch(function(ex) {
      console.log(ex);
    })
}
function fetchPostFunc(endpoint, object, response){
  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(object)
  })
    .then(function(res) {
      return res.json();
    }).then(function(json) {
      response(json);
    }).catch(function(ex) {
      console.log('parsing failed', ex)
    });
}

// function updateActualFunc(){
//   fetchFunc('/verplaylist',function(json){
    // videoActual = {
    //   url: json[0].url, 
    //   id: json[0]._id, 
    //   thumbnail: json[0].thumbnail
    // };
//     videoActual = json[0].url
//   });
// }

// updateActualFunc();
// console.log(videoActual)

function onYouTubeIframeAPIReady() {
  player = new YT.Player('iframe', {
    height: '360',
    width: '640',
    videoId: '_Uie2r5wWxw',
    playerVars: {
      'disablekb': 1
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}
function onPlayerReady(event) {
  socket.emit('tiempo actual');
}
function onPlayerStateChange(event) {
  // console.log(event.data);
}
document.addEventListener('touchstart',{passive: true});
document.addEventListener('touchmove',{passive: true});
