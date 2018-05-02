class Rockola extends React.Component {
  constructor(props) {
    super(props);
    this.state = {results: '', player: false};
  }
  componentDidMount(){
    const _this = this;
    userSession = decodeURIComponent(document.cookie.split('session=')[1]).split('|');
    fetchPost('/getuserpermissions',{
      email: userSession[0]
    },
    function(json){
      _this.setState({player: json.player});
    });
  }
  render() {
    return (
      <div id="main-container">
        <SearchBar/>
        <Results/>
        <Playlist/>      
        <PlayerBar/>
        {this.state.player &&
          <div id="iframe-yt"></div>
        }
      </div>
    );
  }
}
  
ReactDOM.render(
  <Rockola />,
  document.getElementById('rockola')
); 