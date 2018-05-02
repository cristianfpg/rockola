class PlayerBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {vote: true, votes: null};
  }
  componentDidMount(){
    const _this = this;      
    socket.on('new song',function(){
      _this.setState({vote: true});
    })
    socket.on('update votes',function(e){
      _this.setState({votes: e});
    })
    fetchGet('/getvotes',function(data){
      _this.setState({votes: data.msg});
    })
  }
  handleVotes(e){
    const _this = this;
    fetchGet('/getplaylist',function(data){
      if(data[0].owner == userSession[0]){
        alert('No puede votar por su propia cancion');
      }else{
        fetchPost('/votes',{
          vote: e,
          participant: userSession[0]
        },
        function(json){
          alert(json.msg);
        });
      }
    });
    _this.setState({vote: false});
  }
  render() {
    return (
      <div className="player-bar">
        {this.state.vote &&
          <div className="votes">
            <button onClick={() => this.handleVotes(1)}>Likes</button>  
            <button onClick={() => this.handleVotes(-1)}>Dislikes</button>
          </div> 
        }
        {this.state.votes}
      </div>
    );
  }
}