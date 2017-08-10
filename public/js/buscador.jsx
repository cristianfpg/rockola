class Buscador extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: '', valueID: '', videos: []};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeID = this.handleChangeID.bind(this);
    this.handleSubmitID = this.handleSubmitID.bind(this);
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
    let parametros = '&part=snippet&maxResults=15&type=video&videoDuration=medium&videoEmbeddable=true&videoDimension=2d&videoLicense=youtube&key='+apiKey;
    let queryKeyword = baseQuery+thisH.state.value+parametros;
    fetch(queryKeyword)
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
  handleChangeID(event) {
    this.setState({valueID: event.target.value});
  }
  handleSubmitID(event) {
    let baseQuery = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id=';
    let finQuery = '&key='+apiKey;
    let url = this.state.valueID;
    let thisH = this;
    fetch(baseQuery+url+finQuery)
      .then(function(response) {
        return response.json();
      }).then(function(json) {
        let titulo = json.items[0].snippet.title;
        let thumbnail = json.items[0].snippet.thumbnails.high.url;
        thisH.props.listItems(
          <Cancion
            key={url}
            titulo={titulo}
            thumbnail={thumbnail}
            agregar={thisH.handleAgregar}
          />
        );
      }).catch(function(ex) {
        thisH.props.listItems(<p>Este id no existe</p>);
        console.log('parsing failed', ex);
      })
    event.preventDefault();
  }
  render() {
    return (
      <div>
        <form id="buscadorkeyword" onSubmit={this.handleSubmit}>
          <input type="text" onChange={(e) => this.handleChange(e,'keyword')} placeholder="palabra clave"/>
          <input type="submit" value="submit"/>
        </form>
        {/*
        <form id="buscadorid" onSubmit={this.handleSubmitID}>
          <input type="text" onChange={this.handleChangeID} placeholder="id"/>
          <input type="submit" value="submit"/>
        </form>
        */}
      </div>
    );
  }
}
