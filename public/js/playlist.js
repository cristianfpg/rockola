class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {playlist: ''};
  }
  componentDidMount(){
    let listItems = [];
    let filtros = [];
    let thisH = this;
    fetch('/verplaylist')
      .then(function(response) {
        return response.json();
      }).then(function(json) {
        for (var value of json) {
          let titulo = value.titulo;
          filtros.push(titulo);
        }
        listItems = filtros.map((filtro) =>
          <li>
            {filtro}
          </li>
        );
        thisH.setState({playlist: listItems})

      }).catch(function(ex) {
        alert('no hay canciones en la playlistt');
      })
  }
  render() {
    return (
      <ul id="playlist">{this.state.playlist}</ul>
    );
  }
}