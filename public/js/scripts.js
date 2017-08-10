var socket = io();

var apiKey = 'AIzaSyDKjZKBuDuPdqgpNZmqby6-iqKTJ66W8JU';
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;
var videoActual;
var primeraVez = true;

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

function fetchPostFunc(endpoint, object){
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
      // console.log('listo');
    }).catch(function(ex) {
      console.log('parsing failed', ex)
    });
}

function updateActualFunc(){
  fetchFunc('/verplaylist',function(json){
    videoActual = {url: json[0].url, id: json[0]._id, thumbnail: json[0].thumbnail};
  });
}
updateActualFunc();

function onYouTubeIframeAPIReady() {
  player = new YT.Player('iframe', {
    height: '360',
    width: '640',
    videoId: videoActual.url,
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
  event.target.playVideo();
  // document.getElementById('iframeimg').src = videoActual.thumbnail;
  console.log(videoActual.url);
}

function onPlayerStateChange(event) {
  console.log(event.data);
  setTimeout(function(){
    fetchPostFunc('/borrarcancion', {iduno: videoActual.id})
    location = location;
  // },15000);
  },480000);
  if(event.data == 0) {
    fetchPostFunc('/borrarcancion', {iduno: videoActual.id})
    location = location;
  }
}
document.addEventListener('touchstart',{passive: true});
document.addEventListener('touchmove',{passive: true});
