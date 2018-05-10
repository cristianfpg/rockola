class PlayerBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {vote: true, votes: null, songtitle: null, ownerimage: null, progressfin: 0, progressactual: 0};
  }
  componentDidMount(){
    const _this = this;  
    socket.emit('new song');    
    socket.on('new song',function(){
      _this.setState({vote: false});      
      var myTimer = setTimeout(function(){
        _this.setState({vote: true});
      },1000);
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
      socket.emit('progress bar');
    })
    socket.emit('update votes');
    socket.on('update votes',function(e){
      const vActual = e[0];
      const cSockets = e[1];
      const voteToSkip = Math.ceil(cSockets * 0.2);
      const totalBar = voteToSkip + cSockets;
      const percentVotes = 100/totalBar;
      _this.setState({votes: [percentVotes,vActual,voteToSkip]});
    })
    socket.on('progress bar',function(e){
      _this.setState({progressactual: e[0], progressfin: e[1]});
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
          if(json.msg == 'Ya votó') alert(json.msg);
        });
      }
    });
    _this.setState({vote: false});
  }
  render() {
    const pActual = this.state.progressactual;
    const pFin = this.state.progressfin;
    const percentBar = (pActual*100)/pFin

    const stateVotes = this.state.votes || [0,0,0];
    const markStyle = {left: `${stateVotes[0]*stateVotes[2]}%`};
    let styles = {};

    if(stateVotes[1] >= 0){
      styles = {
        left: `${stateVotes[0]*stateVotes[2]}%`, 
        backgroundColor: '#4AD593',
        width: `${stateVotes[0]*stateVotes[1]}%`
      };
    }else{
      styles = {
        right: `${100-(stateVotes[0]*stateVotes[2])}%`,
        backgroundColor: '#FF3366',
        width: `${stateVotes[0]*-stateVotes[1]}%`
      };
    }
    
    return (
      <div className="player-bar">
        <div className="gradient"></div>
        <div className="progress-bar" style={{width: `${percentBar}%`}}></div>
        {this.state.ownerimage}
        <div className="title">
          <h1 className="songtitle">{this.state.songtitle}</h1>
          <div className={`votes ${this.state.vote}`}>
            <button className="btn-vote" onClick={() => this.handleVotes(-1)}><img src="/assets/img/dislike.png"/></button>
            <div className="votes-state">
              <div className="mark" style={markStyle}></div>
              <div className="actual-vote-bar" style={styles}></div>
            </div>
            <button className="btn-vote" onClick={() => this.handleVotes(1)}><img src="/assets/img/like.png"/></button>  
          </div> 
        </div>
      </div>
    );
  }
}