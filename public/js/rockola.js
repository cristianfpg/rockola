var socket = io();

var apiKey = 'AIzaSyDKjZKBuDuPdqgpNZmqby6-iqKTJ66W8JU';
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;
var minDuration = 180;
var maxDuration = 540;
var nSearch = 30;
var userSession;

// base endpoints
var epSearch = 'https://www.googleapis.com/youtube/v3/search?q=';
var epDetails = 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet,statistics&id=';

// params
var pSearch = '&part=snippet&maxResults='+nSearch+'&type=video&videoEmbeddable=true&videoDimension=2d&videoLicense=youtube&key='+apiKey;

function fetchGet(query,dataResponse){
  fetch(query)
    .then(function(response) {
      return response.json();
    }).then(function(json) {
      dataResponse(json);
    }).catch(function(ex) {
      console.log('error en ',query);
      console.log(ex);
    })
}

function fetchPost(query,params,callback){
  fetch(query, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  })
  .then(function(res) {
    return res.json();
  }).then(function(json) {
    callback(json);
  }).catch(function(ex) {
    console.log('error en ',query);
    console.log(ex);
  });
}
function updatePlaylist(callback){
  fetchGet('/getplaylist',function(data){
    callback(data);
  })
}
function numberFormat(nStr) {
  nStr += '';
  x = nStr.split('.');
  x1 = x[0];
  x2 = x.length > 1 ? ',' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + '.' + '$2');
  }
  return x1 + x2;
}
function onYouTubeIframeAPIReady() {
  player = new YT.Player('iframe-yt', {
    height: '360',
    width: '640',
    videoId: '_Uie2r5wWxw',
    host: 'https://www.youtube.com',
    playerVars: {
      'disablekb': 1
    },
    events: {
      'onReady': onPlayerReady
    }
  });
}
function onPlayerReady(event) {
  socket.emit('get actual song'); 
  socket.on('get actual song',function(data){
    player.loadVideoById({
      videoId: data[0],
      startSeconds: data[1]
    })
  })
}
