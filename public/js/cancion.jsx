// fetchFunc('https://www.googleapis.com/youtube/v3/videos?id=ebhoaxFyDuM&part=contentDetails&key='+apiKey,function(json){
//   console.log(json);
// })
class Cancion extends React.Component {
  constructor(props) {
    super(props);
    this.addToPlaylist = this.addToPlaylist.bind(this);
  }
  addToPlaylist(event){
    let thisH = this;
    fetch('/agregaraplaylist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({titulo: this.props.titulo, url: this.props.videoId, thumbnail: this.props.thumbnail})
    })
      .then(function(res) {
        return res.json();
      }).then(function(json) {
        thisH.props.agregar(json);
      }).catch(function(ex) {
        console.log('parsing failed', ex)
      });
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
