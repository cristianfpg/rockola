class Playlist extends React.Component {
    constructor(props) {
      super(props);
      this.state = {playlist: [], actualsong: null};      
    }
    componentDidMount(){
      let playlist;
      const _this = this;
      socket.emit('update playlist');
      socket.on('update playlist',function(){
        updatePlaylist(function(data){
          let das = data.shift();
          const actualsong = <div className="actual-song">
            <div className="thumbnail" style={{backgroundImage: `url(${das.sthumbnail})`}}></div>
            <p className="title">{das.title}</p>
            <div className="channel-content">
              <p className="channel">{das.channel}</p>
              <img className="bars" src="/assets/img/bars.gif"/>
            </div>
          </div>;
          playlist = data.map((info,index) =>
            <p key={info.idkey}>
              <span>{index+1}</span>{info.title}
            </p>
          );
          _this.setState({playlist,actualsong});
        })
      })
    }
    render() {
      return (
        <div className="playlist">
          <p className="titulo">Playlist</p>
          {this.state.actualsong}
          <div className="other-songs">
            {this.state.playlist}
          </div>
        </div>
      );
    }
  }