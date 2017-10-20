function updatePlaylistFunc(thisH){
  let listItems = [];
  let filtros = [];
  fetchFunc('/verplaylist',function(json){
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
    thisH.setState({playlist: listItems});
  });
}
class Rockola extends React.Component {
  constructor(props) {
    super(props);
    this.state = {resultados: '', playlist: ''};
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
    // socket.on('obtener id', function(msg){
    //   console.log(msg);
    // });
    window.onload = function(){
      socket.emit('obtener nombre',socket.id);
    }
    socket.on('obtener nombre', function(msg){
      console.log(msg);
    });
    socket.on('tiempo actual', function(msg){
      urlActual = msg.urlActual;
      player.loadVideoById({
        videoId: msg.urlActual,
        startSeconds: msg.tiempoActual+1,
      })
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
          <img id="iframeimg"/>
          <div id="iframe"></div>
        </div>
        <div id="resultados">{this.state.resultados}</div>
        <div id="playlist">{this.state.playlist}</div>
      </div>
    );
  }
}
ReactDOM.render(
  <Rockola />,
  document.getElementById('rockola')
);
