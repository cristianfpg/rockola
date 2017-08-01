var raiz = 'https://www.googleapis.com/youtube/v3/';
var apiKey = 'AIzaSyDKjZKBuDuPdqgpNZmqby6-iqKTJ66W8JU';
var videoIframe = document.getElementById('videoIframe');
videoIframe.src = 'https://www.youtube.com/embed/'+'DqDeH3hwxfw'+'?rel=0&autoplay=1&controls=1&enablejsapi=1';

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('videoIframe', {
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerStateChange(e){
  console.log(e);
}
