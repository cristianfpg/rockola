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
    let thisH = this;
    fetch(getQuery)
      .then(function(response) {
        return response.json();
      }).then(function(json) {
        var duration = json.items[0].contentDetails.duration+'';
        var match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        if(!match){
          alert('El video debe durar de '+(duracionMin/60)+' a '+(duracionMax/60)+' min');
          return false;
        } 
        var hours = (parseInt(match[1]) || 0);
        var minutes = (parseInt(match[2]) || 0);
        var seconds = (parseInt(match[3]) || 0);
        var totalSegundos = seconds + (minutes*60) + (hours*3600);
        if(totalSegundos >= duracionMin && totalSegundos <= duracionMax){
          fetch('/agregaraplaylist', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              titulo: thisH.props.titulo, 
              url: thisH.props.videoId, 
              thumbnail: thisH.props.thumbnail,
              duracion: totalSegundos,
              owner: readCookie('sesion')
            })
          })
          .then(function(res) {
            return res.json();
          }).then(function(json) {
            if(json.respuesta == 'creada' || json.respuesta == 'activada'){
              thisH.props.agregar(json);
              socket.emit('update playlist');
              alert('hecho!')
            }else{
              alert('ya esta en la playlist')
            }
          }).catch(function(ex) {
            console.log('parsing failed', ex)
          });
        }else{
          alert('El video debe durar de '+(duracionMin/60)+' a '+(duracionMax/60)+' min');
        }
      }).catch(function(ex) {
        console.log('parsing failed', ex)
      })
  }
  render() {
    return (
      <div className='video' onClick={this.addToPlaylist}>
        <p>{this.props.titulo}</p>
        {/*
        <img src={this.props.thumbnail}/>
        */}
      </div>
    );
  }
}
