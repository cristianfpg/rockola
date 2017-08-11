class Votos extends React.Component {
  constructor(props) {
    super(props);
    this.votarCancion = this.votarCancion.bind(this);
  }
  votarCancion(event, msg){
    console.log(this.props.idCancion);
  }
  render() {
    return (
      <div className="playlist-btns">
        <div className="playlist-btn like" onClick={(e) => this.votarCancion(e,'like')}>✓</div>
        <div className="playlist-btn unlike" onClick={(e) => this.votarCancion(e,'unlike')}>✗</div>
      </div>
    );
  }
}
