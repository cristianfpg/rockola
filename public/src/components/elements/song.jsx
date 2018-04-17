class Song extends React.Component {
  constructor(props){
    super(props);
    this.addToPlaylist = this.addToPlaylist.bind(this);
  }
  addToPlaylist(){
    const _this = this;
    fetchPost('/addtoplaylist',{
      idkey: _this.props.idkey,
      title: _this.props.title,
      sthumbnail: _this.props.sthumbnail,
      duration: _this.props.duration
    },
    function(json){
      socket.emit('update playlist');
      alert(json.msg);
    });
  }
  render() {
    return (
      <div className="song">
        <p>{this.props.title}</p>
        <p>{this.props.views}</p>
        <a onClick={this.addToPlaylist}>click</a>
      </div>
    );
  }
}
