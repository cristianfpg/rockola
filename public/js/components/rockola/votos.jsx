class Votos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {like: '', dislike:'', done: false};
    this.votarCancion = this.votarCancion.bind(this);
  }
  votarCancion(event, msg){
    fetch('/voto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        urlActual: urlActual, 
        participante: miSesion
      })
    })
    .then(function(res) {
      return res.json();
    }).then(function(json) {
      console.log(msg)
      console.log(miSesion)
      console.log(urlActual)
    }).catch(function(ex) {
      console.log('parsing failed', ex)
    });
  }
  render() {
    return (
      <div className={"playlist-btns "+this.state.done}>
        <div className={"playlist-btn like "+this.state.like} onClick={(e) => this.votarCancion(e,'like')}>✓</div>
        <div className={"playlist-btn dislike "+this.state.dislike} onClick={(e) => this.votarCancion(e,'dislike')}>✗</div>
      </div>
    );
  }
}
