function actualizarBotonesFunc(thisH){
  fetchFunc('/verplaylist',function(json){
    if(thisH.props.url == json[0].url){
      thisH.setState({like: '', dislike: ''});
    }
  });
}
class Votos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {like: '', dislike: '', voto: false};
    this.votarCancion = this.votarCancion.bind(this);
  }
  componentWillMount(){
    var thisH = this;
    actualizarBotonesFunc(thisH);
    socket.on('update votos', function(){
      actualizarBotonesFunc(thisH);
    }); 
    socket.on('update playlist', function(){
      thisH.setState({like: '', dislike: '', voto: false});
    });
  }
  votarCancion(event, msg){
    var thisH = this;
    if(!thisH.state.voto){
      fetch('/voto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          urlActual: urlActual,
          participante: readCookie('sesion'),
          voto: msg
        })
      })
      .then(function(res) {
        return res.json();
      }).then(function(json) {
        if(msg == 'like') thisH.setState({voto: true, like: 'active', dislike: 'block'});
        if(msg == 'dislike') thisH.setState({voto: true, like: 'block', dislike: 'active'});
        if(json == 'ya voto') thisH.setState({voto: true, like: 'hide', dislike: 'hide'});
      }).catch(function(ex) {
        console.log('parsing failed', ex)
      });
    }
  }
  render() {
    return (
      <div className={"playlist-btns"}>
        <div className={"playlist-btn like "+this.state.like} onClick={(e) => this.votarCancion(e,'like')}>✓</div>
        <div className={"playlist-btn dislike "+this.state.dislike} onClick={(e) => this.votarCancion(e,'dislike')}>✗</div>
      </div>
    );
  }
}
