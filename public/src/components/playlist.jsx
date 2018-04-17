class Playlist extends React.Component {
    constructor(props) {
      super(props);
      this.state = {playlist: []};      
    }
    componentDidMount(){
      let playlist;
      const _this = this;
      updatePlaylist(function(data){
        playlist = data.map((info) =>
          <p key={info.idkey}>{info.title}</p>
        );
        _this.setState({playlist: playlist});
      })
      socket.on('update playlist',function(){
        updatePlaylist(function(data){
          playlist = data.map((info) =>
            <p key={info.idkey}>{info.title}</p>
          );
          _this.setState({playlist: playlist});
        })
      })
    }
    render() {
      return (
        <div className="playlist">{this.state.playlist}</div>
      );
    }
  }