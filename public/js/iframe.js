class Iframe extends React.Component {
  handleVerUltimo(event){
  }
  render() {
    return (
      <iframe id="videoIframe" width="560" height="315" frameBorder="0" allowFullScreen></iframe>
    );
  }
}
window.onload = function(){

}

var pruebaurl;
fetch('http://localhost:3000/verplaylist')
  .then(function(response) {
    return response.json();
  }).then(function(json) {
    pruebaurl = json.url;
    console.log(pruebaurl)
    var videoIframe = document.getElementById('videoIframe');
    videoIframe.src = 'https://www.youtube.com/embed/'+pruebaurl+'?rel=0&autoplay=0&controls=1&enablejsapi=1';

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
    console.log('parsing failed', ex)
  })