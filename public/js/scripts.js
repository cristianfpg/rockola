var socket = io();

var apiKey = 'AIzaSyDKjZKBuDuPdqgpNZmqby6-iqKTJ66W8JU';
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;
var duracionMin = 180;
var duracionMax = 540;
var numeroBusqueda = 30;
var urlActual;

// base endpoints
var epSearch = 'https://www.googleapis.com/youtube/v3/search?q=';
var epDetails = 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet,statistics&id=';

// params
var pSearch = '&part=snippet&maxResults='+numeroBusqueda+'&type=video&videoEmbeddable=true&videoDimension=2d&videoLicense=youtube&key='+apiKey;
var pDetails = '';

function fetchQuery(query,dataResponse){
  fetch(query)
    .then(function(response) {
      return response.json();
    }).then(function(json) {
      dataResponse(json);
    }).catch(function(ex) {
      console.log(ex);
    })
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player('iframe', {
    height: '360',
    width: '640',
    videoId: '_Uie2r5wWxw',
    playerVars: {
      'disablekb': 1
    },
    events: {
      'onReady': onPlayerReady
    }
  });
}
function onPlayerReady(event) {
  socket.emit('tiempo actual');
}