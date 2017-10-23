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
        <Votos url={filtro.url}/>
      </div>
    );
    thisH.setState({playlist: listItems, minFinalReproductor: minFinalReproductor, nombreActual: nombreActual});
  });
}

class Rockola extends React.Component {
  constructor(props) {
    super(props);
    this.state = {resultados: '', playlist: '', minFinalReproductor: '', minActualReproductor: '', cssProgreso: '', nombreActual: ''};
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleAgregar = this.handleAgregar.bind(this);
  }
  handleUpdate(e){
    this.setState({resultados: e});
  }
  componentWillMount(){
    let thisH = this;
    updatePlaylistFunc(thisH);
    socket.on('update playlist', function(){
      updatePlaylistFunc(thisH);
    }); 
    socket.on('tiempo actual', function(msg){
      var urlActual;
      var tiempoActual = msg.tiempoActual+1;
      var tiempoFinal = thisH.state.minFinalReproductor;
      
      urlActual = msg.urlActual;
      var intervalReproductor;      
      thisH.setState({minActualReproductor: tiempoActual});
      player.loadVideoById({
        videoId: msg.urlActual,
        startSeconds: msg.tiempoActual
      })
      clearInterval(intervalReproductor);
      intervalReproductor = setInterval(function(){ 
        tiempoActual++; 
        var cssProgreso = (tiempoActual*100)/tiempoFinal;
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
        <Buscador listItems={this.handleUpdate} agregar={this.handleAgregar}/>
        <div>
          <div id="iframe"></div>
        </div>
        <div id="resultados">{this.state.resultados}</div>
        <div id="playlist">{this.state.playlist}</div>
        <div id="reproductor">
          <div className="controles">
            <p className="nombre-cancion">{this.state.nombreActual}</p>
            <p className="inicio">{this.state.minActualReproductor}</p>
            <div className="progreso">
              <div style={{width: this.state.cssProgreso +'%'}} className="progreso-actual"></div>
            </div>
            <p className="fin">{this.state.minFinalReproductor}</p>            
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
