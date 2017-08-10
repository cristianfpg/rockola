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
      <li key={filtro.url}>
        <p>{filtro.titulo}</p>
        <p>{filtro.url}</p>
      </li>
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
  }
  handleAgregar() {
    let thisH = this;
    updatePlaylistFunc(thisH);
  }
  render() {
    return (
      <div>
        <Buscador listItems={this.handleUpdate} agregar={this.handleAgregar}/>
        <Iframe/>
        <Resultados lista={this.state.resultados}/>
        <Playlist playlist={this.state.playlist}/>
      </div>
    );
  }
}
ReactDOM.render(
  <Rockola />,
  document.getElementById('rockola')
);
