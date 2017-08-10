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

var apiKey = 'AIzaSyDKjZKBuDuPdqgpNZmqby6-iqKTJ66W8JU';
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;

var videoActual;
var primeraVez = true;
function updateActualFunc(){
  fetchFunc('/verplaylist',function(json){
    videoActual = {url: json[0].url, id: json[0]._id};
  });
}
updateActualFunc();

function onYouTubeIframeAPIReady() {
  player = new YT.Player('iframe', {
    height: '360',
    width: '640',
    videoId: videoActual.url,
    playerVars: { 'controls': 1 },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  event.target.playVideo();
  console.log(videoActual.url);
}

function onPlayerStateChange(event) {
  console.log(event.data)
  if(event.data == 0) {
    fetchPostFunc('/borrarcancion', {iduno: videoActual.id})
    location = location;
  }
}
document.addEventListener('touchstart',{passive: true});
document.addEventListener('touchmove',{passive: true});
