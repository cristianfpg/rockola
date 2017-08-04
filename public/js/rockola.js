var raiz = 'https://www.googleapis.com/youtube/v3/';
var apiKey = 'AIzaSyDKjZKBuDuPdqgpNZmqby6-iqKTJ66W8JU';
var videoIframe = document.getElementById('videoIframe');
videoIframe.src = 'https://www.youtube.com/embed/'+'kfCkVaGttiM'+'?rel=0&autoplay=0&controls=1&enablejsapi=1';

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('videoIframe', {
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
}
function onPlayerStateChange(e){
  // console.log(e);
}
