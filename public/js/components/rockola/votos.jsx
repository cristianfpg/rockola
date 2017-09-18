class Votos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {like: '', dislike:'', done: false};
    this.votarCancion = this.votarCancion.bind(this);
  }
  votarCancion(event, msg){
    fetchPostFunc('/voto',{url: this.props.url, voto: msg});
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