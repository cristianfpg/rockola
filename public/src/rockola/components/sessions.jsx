class Sessions extends React.Component {
  constructor(props){
    super(props);
    this.state = {sessions: null};
  }
  componentDidMount(){
    const _this = this;
    socket.emit('listen sessions');
    socket.on('listen sessions',function(){
      fetchGet('/getsessions',function(data){
        const getUsers = data.data.map((user)=>{
          const styleImg = {
            backgroundImage: `url(${user.image})`
          };
          return <div className="user" style={styleImg}></div>;
        });
        _this.setState({sessions: getUsers});
      })
    });
  }
  render(){
    return(
      <div className="sessions">
        <p className="titulo">Sesiones</p>
        {this.state.sessions}
      </div>
    );
  }
}
