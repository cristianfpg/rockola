function updatePlaylistFunc(thisH){
  let listItems = [];
  let filtros = [];
  fetchFunc('/verplaylist',function(json){
    let minFinalReproductor = json[0].duracion;
    let nombreActual = json[0].titulo;
    for (var value of json) {
      let titulo = value.titulo;
      let url = value.url;
      let id = value._id;
      filtros.push({titulo: titulo, url: url, id: id});
    }
    listItems = filtros.map((filtro) =>
      <div className="playlist-item" key={filtro.url}>
        <p className="playlist-titulo">{filtro.titulo}</p>
      </div>
    );
    thisH.setState({playlist: listItems, minFinalReproductor: minFinalReproductor, nombreActual: nombreActual});
  });
}

class Rockola extends React.Component {
  constructor(props) {
    super(props);
    this.state = {resultados: '', playlist: '', minFinalReproductor: '', minActualReproductor: '', cssProgreso: '', nombreActual: '', urlActual: '', owner: ''};
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleAgregar = this.handleAgregar.bind(this);
    this.handleMute = this.handleMute.bind(this);
    this.handleSound = this.handleSound.bind(this);
  }
  handleUpdate(e){
    this.setState({resultados: e});
  }
  handleMute(e){
    player.setVolume(0);
    player.mute();
  }
  handleSound(e){
    player.setVolume(100);
    player.unMute();
  }
  componentWillMount(){
    let thisH = this;
    var intervalReproductor;
    updatePlaylistFunc(thisH);
    socket.on('update playlist', function(){
      updatePlaylistFunc(thisH);
    }); 
    socket.on('tiempo actual', function(msg){
      var urlActual = msg.urlActual;
      var tiempoActual = msg.tiempoActual+1;
      var tiempoFinal = thisH.state.minFinalReproductor;
      var cssProgreso;
      thisH.setState({minActualReproductor: tiempoActual, urlActual: urlActual});
      player.loadVideoById({
        videoId: msg.urlActual,
        startSeconds: msg.tiempoActual
      })
      player.setVolume(100);
      player.unMute();  
      clearInterval(intervalReproductor);
      intervalReproductor = setInterval(function(){ 
        tiempoActual++; 
        cssProgreso = (tiempoActual*100)/tiempoFinal;
        thisH.setState({cssProgreso: cssProgreso, minActualReproductor: tiempoActual});
        if(tiempoActual>=thisH.state.minFinalReproductor) clearInterval(intervalReproductor);
      },1000);    
    });
  }
  handleAgregar(event) {
    let thisH = this;
    updatePlaylistFunc(thisH);
  }
  render() {
    return (
      <div>
        <div>
          <div id="iframe"></div>
        </div>
        <div id="resultados">
          <Buscador listItems={this.handleUpdate} agregar={this.handleAgregar}/>
          {this.state.resultados}
        </div>
        <div id="playlist">
          <p className="titulo-playlist">Playlist</p>
          {this.state.playlist}
        </div>
        <div id="reproductor">
          <p className="btn-sound" onClick={this.handleSound}>o</p>
          <p className="btn-mute" onClick={this.handleMute}>ø</p>
          <div className="controles">
            <p className="nombre-cancion">{this.state.nombreActual}</p>
            <div className="barra-progreso">
              <p className="inicio">{Math.floor(this.state.minActualReproductor/60)}:{this.state.minActualReproductor - Math.floor(this.state.minActualReproductor/60) * 60}</p>
              <div className="progreso">
                <div style={{width: this.state.cssProgreso +'%'}} className="progreso-actual"></div>
              </div>
              <p className="fin">{Math.floor(this.state.minFinalReproductor/60)}:{this.state.minFinalReproductor - Math.floor(this.state.minFinalReproductor/60) * 60}</p>
            </div>
            <Votos url={this.state.urlActual} owner={this.state.owner}/>
          </div>
        </div>
      </div>
    );
  }
}
ReactDOM.render(
  <Rockola />,
  document.getElementById('rockola')
);
