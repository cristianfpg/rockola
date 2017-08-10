class Buscador extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: '', videos: []};
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
    fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q='+thisH.state.value+'&key='+apiKey)
      .then(function(response) {
        return response.json();
      }).then(function(json) {
        console.log(json);
        for (var value of json.items) {
          let thumbnail = value.snippet.thumbnails.default.url;
          let titulo = value.snippet.title;
          let id = value.id.videoId;
          let valido = true;
          if(!value.id.videoId) (id=titulo) && (valido = false);
          filtros.push({
            titulo: titulo,
            id: id,
            thumbnail: thumbnail,
            valido : valido
          });
        }
        listItems = filtros.map((filtro) =>
          <Cancion
            valido={filtro.valido}
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
      <form id="buscador" onSubmit={this.handleSubmit}>
        <input type="text" onChange={this.handleChange}/>
        <input type="submit" value="submit"/>
      </form>
    );
  }
}
