class Votos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {like: '', dislike:'', done: false};
    this.votarCancion = this.votarCancion.bind(this);
  }
  votarCancion(event, msg){
    var id = socket.io.engine.id;
    alert(id);

    // fetch('/misesion')
    //   .then(function(response) {
    //     console.log(response);
    //     return response.json();
    //   }).then(function(json) {
    //     console.log(json);
    //   })
    // fetch('/voto', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     urlActual: urlActual
    //   })
    // })
    // .then(function(res) {
    //   return res.json();
    // }).then(function(json) {
    //   console.log(msg)
    // }).catch(function(ex) {
    //   console.log('parsing failed', ex)
    // });
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
