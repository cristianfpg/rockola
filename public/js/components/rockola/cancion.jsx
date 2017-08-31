class Cancion extends React.Component {
  constructor(props) {
    super(props);
    this.addToPlaylist = this.addToPlaylist.bind(this);
  }
  addToPlaylist(event){
    let videoId = this.props.videoId;
    let baseQuery = 'https://www.googleapis.com/youtube/v3/videos?id=';
    let parametros = '&part=contentDetails&key='+apiKey;
    let getQuery = baseQuery+videoId+parametros;
    fetch(getQuery)
      .then(function(response) {
        return response.json();
      }).then(function(json) {
        var texto = json.items[0].contentDetails.duration+'';
        function tiempoFunc(duration) {
          var match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)

          var hours = (parseInt(match[1]) || 0);
          var minutes = (parseInt(match[2]) || 0);
          var seconds = (parseInt(match[3]) || 0);
          console.log(hours+' '+minutes+' '+seconds)
          // return hours * 3600 + minutes * 60 + seconds;
        }
        tiempoFunc(texto);
      }).catch(function(ex) {
        console.log('parsing failed', ex)
      })
    // let thisH = this;
    // fetch('/agregaraplaylist', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({titulo: this.props.titulo, url: this.props.videoId, thumbnail: this.props.thumbnail})
    // })
    //   .then(function(res) {
    //     return res.json();
    //   }).then(function(json) {
    //     if(json.respuesta == 'creada' || json.respuesta == 'activada'){
    //       thisH.props.agregar(json);
    //       socket.emit('update playlist', json);
    //     }
    //   }).catch(function(ex) {
    //     console.log('parsing failed', ex)
    //   });
  }
  render() {
    return (
      <div className='video' onClick={this.addToPlaylist}>
        <p>{this.props.titulo}</p>
        <img src={this.props.thumbnail}/>
      </div>
    );
  }
}
