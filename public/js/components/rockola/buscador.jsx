class Buscador extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: '', valueID: '', videos: []};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAgregar = this.handleAgregar.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }
  handleAgregar(event) {
    this.props.agregar(event);
  }
  handleSubmit(event) {
    let listItems = [];
    let filtros = [];
    let thisH = this;
    let baseQuery = 'https://www.googleapis.com/youtube/v3/search?q=';
    let parametros = '&part=snippet&maxResults=15&type=video&videoEmbeddable=true&videoDimension=2d&videoLicense=youtube&key='+apiKey;
    let getQuery = baseQuery+thisH.state.value+parametros;
    fetch(getQuery)
      .then(function(response) {
        return response.json();
      }).then(function(json) {
        for (var value of json.items) {
          let thumbnail = value.snippet.thumbnails.high.url;
          let titulo = value.snippet.title;
          let id = value.id.videoId;
          if(!value.id.videoId) continue;
          filtros.push({
            titulo: titulo,
            id: id,
            thumbnail: thumbnail
          });
        }
        listItems = filtros.map((filtro) =>
          <Cancion
            videoId={filtro.id}
            key={filtro.id}
            titulo={filtro.titulo}
            thumbnail={filtro.thumbnail}
            agregar={thisH.handleAgregar}
          />
        );
        thisH.props.listItems(listItems);
      }).catch(function(ex) {
        console.log('parsing failed', ex)
      })

    event.preventDefault();
  }
  render() {
    return (
      <div>
        <form id="buscadorkeyword" onSubmit={this.handleSubmit}>
          <input type="text" onChange={this.handleChange} placeholder="palabra clave"/>
          <input type="submit" value="submit"/>
        </form>
      </div>
    );
  }
}