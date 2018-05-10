class Song extends React.Component {
  constructor(props){
    super(props);
    this.state = {active: ''};
    this.addToPlaylist = this.addToPlaylist.bind(this);
  }
  addToPlaylist(){
    if(document.cookie.search('cooldown=true') > 0){
      alert('Puede agregar una cancion cada '+turnCooldown+' minutos.');
      return true;
    }
    console.log();
    const _this = this;
    _this.setState({active: 'active'});
    fetchPost('/addtoplaylist',{
      idkey: _this.props.idkey,
      owner: userSession[0],
      title: _this.props.title,
      sthumbnail: _this.props.sthumbnail,
      duration: _this.props.duration,
      channel: _this.props.channel,
      minutes: _this.props.minutes,
      seconds: _this.props.seconds
    },
    function(json){
      socket.emit('update playlist');
      if(json.msg == 'En playlist'){
        alert(json.msg);
      }else{
        var d = new Date();
        d.setTime(d.getTime() + turnCooldown*(60*1000));
        document.cookie = 'cooldown=true;expires='+d.toGMTString()+';';
      }
    });
  }
  render() {
    const isHigher = this.props.seconds < 10;
    const newSec = `0${this.props.seconds}`
    return (
      <div className={`song row ${this.state.active}`} onMouseUp={this.addToPlaylist}>
        <div className="column thumbnail">
          <div style={{backgroundImage: `url(${this.props.sthumbnail})`}}></div>
        </div>
        <p className="column title-name">{this.props.title}</p>
        <p className="column channel">{this.props.channel}</p>
        <p className="column views">{this.props.views}</p>
        <p className="column time">{this.props.minutes}:{isHigher ? newSec : this.props.seconds}</p>
        <a className="column button">+</a>
      </div>
    );
  }
}
