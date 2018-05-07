class Song extends React.Component {
  constructor(props){
    super(props);
    this.addToPlaylist = this.addToPlaylist.bind(this);
  }
  addToPlaylist(){
    const _this = this;
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
      }
    });
  }
  render() {
    const isHigher = this.props.seconds < 10;
    const newSec = `0${this.props.seconds}`
    return (
      <div className="song">
        <div className="column thumbnail" style={{backgroundImage: `url(${this.props.sthumbnail})`}}></div>
        <p className="column title">{this.props.title}</p>
        <p className="column channel">{this.props.channel}</p>
        <p className="column views">{this.props.views}</p>
        <p className="column time">{this.props.minutes}:{isHigher ? newSec : this.props.seconds}</p>
        <a className="column button" onClick={this.addToPlaylist}>click</a>
      </div>
    );
  }
}
