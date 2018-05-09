class PlayerBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {vote: true, votes: null, songtitle: null, ownerimage: null};
  }
  componentDidMount(){
    const _this = this;      
    socket.on('new song',function(){
      _this.setState({vote: true});
      fetchGet('/getactualsong',function(data){
        fetchGet('/getsessions',function(dataTwo){
          dataTwo.data.forEach(function(session){
            if(data.owner == session.email){
              const getImage = <div className="ownerimage" style={{backgroundImage: `url(${session.image})`}}></div>;
              _this.setState({songtitle: data.title, ownerimage: getImage});          
            }else if(data.owner == 'server'){
              const getImage = <div className="ownerimage" style={{backgroundImage: `url(${data.sthumbnail})`}}></div>;              
              _this.setState({songtitle: data.title, ownerimage: getImage});
            }
          });
        });
      });
    })
    socket.on('update votes',function(e){
      _this.setState({votes: e});
    })
    fetchGet('/getvotes',function(data){
      _this.setState({votes: data.msg});
    })
    fetchGet('/getactualsong',function(data){
      fetchGet('/getsessions',function(dataTwo){
        dataTwo.data.forEach(function(session){
          if(data.owner == session.email){
            const getImage = <div className="ownerimage" style={{backgroundImage: `url(${session.image})`}}></div>;
            _this.setState({songtitle: data.title, ownerimage: getImage});          
          }else if(data.owner == 'server'){
            const getImage = <div className="ownerimage" style={{backgroundImage: `url(${data.sthumbnail})`}}></div>;              
            _this.setState({songtitle: data.title, ownerimage: getImage});
          }
        });
      });
    });
  }
  handleVotes(e){
    const _this = this;
    fetchGet('/getactualsong',function(data){
      if(data.owner == userSession[0] && false){
        alert('No puede votar por su propia cancion');
      }else{
        fetchPost('/votes',{
          vote: e,
          participant: userSession[0]
        },
        function(json){
          console.log(json.msg);
        });
      }
    });
    _this.setState({vote: false});
  }
  render() {
    return (
      <div className="player-bar">
        <div className="gradient"></div>
        <div className="progress-bar"></div>
        {this.state.ownerimage}
        <div className="title">
          <h1 className="songtitle">{this.state.songtitle}</h1>
          {this.state.vote &&
            <div className="votes">
              <button onClick={() => this.handleVotes(1)}>Likes</button>  
              <button onClick={() => this.handleVotes(-1)}>Dislikes</button>
            </div> 
          }
        </div>
      </div>
    );
  }
}