class Iframe extends React.Component {

  render() {
    return (
      <iframe id="videoIframe" width="560" height="315" frameBorder="0" allowFullScreen></iframe>
    );
  }
}

fetch('/verplaylist')
  .then(function(response) {
    return response.json();
  }).then(function(json) {
    var videoIframe = document.getElementById('videoIframe');
    videoIframe.src = 'https://www.youtube.com/embed/'+json[0].url+'?rel=0&autoplay=0&controls=1&enablejsapi=1';

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
  }).catch(function(ex) {
    alert('no hay canciones en la playlist');
  })