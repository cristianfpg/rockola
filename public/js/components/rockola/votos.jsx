class Votos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {like: '', dislike:'', done: false};
    this.votarCancion = this.votarCancion.bind(this);
  }
  votarCancion(event, msg){
    fetchPostFunc('/votacion',{url: '_Uie2r5wWxw', voto: 'like'}, function(){});
    // if(!this.state.done){
    //   let thisH = this;
    //   fetchPostFunc('/votacion',{url: '_Uie2r5wWxw', voto: 'like'}, function(json){
    //     console.log(json);
    //   });
    //   // msg == 'like' ? thisH.setState({like: 'active',dislike: '', done: true}) : thisH.setState({like: '',dislike: 'active', done: true})
    // }
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
