var socket = io();

var apiKey = 'AIzaSyDKjZKBuDuPdqgpNZmqby6-iqKTJ66W8JU';
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;
var primeraVez = true;
var duracionMin = 180;
var duracionMax = 540;
var numeroBusqueda = 30;
var urlActual;

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
function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
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
function formatearNumero(nStr) {
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