class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value_input: '', userSession: []};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount(){
    const _this = this;
    setTimeout(function(){
      _this.setState({userSession: userSession});
    },1);
  }
  handleChange(event) {
    this.setState({value_input: event.target.value});
  }
  handleSubmit(event){
    const _this = this;
    const qSearch = epSearch+_this.state.value_input+pSearch;
    fetchGet(qSearch,function(data){
      _this.inputTitle.value = '';
      let aSong = [];
      for (var value of data.items) {
        const idkey = value.id.videoId;
        const title = value.snippet.title;
        const sthumbnail = value.snippet.thumbnails.high.url;
        const qDetails = epDetails+idkey+'&key='+apiKey;
        if(!value.id.videoId) continue;
        fetchGet(qDetails,function(data){
          const channel = data.items[0].snippet.channelTitle;
          const dataDuration = data.items[0].contentDetails.duration+'';
          const views = data.items[0].statistics.viewCount;
          const match = dataDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
          const hours = (parseInt(match[1]) || 0);
          const minutes = (parseInt(match[2]) || 0);
          const seconds = (parseInt(match[3]) || 0);
          const duration = seconds + (minutes*60) + (hours*3600);
          if(duration >= minDuration && duration <= maxDuration){
            const song = {idkey, title, sthumbnail, views, duration, channel, minutes, seconds};
            aSong.push(song);
            socket.emit('update results', aSong);
          }
        })
      } 
    });
    _this.inputTitle.value = 'Buscando...';
    event.preventDefault();
  }
  render() {
    let styleImg = {};
    const urlImg =  this.state.userSession[2];
    const srcImg = `url(${urlImg})`;
    if(typeof urlImg != 'undefined'){
      styleImg = {
        backgroundImage: srcImg
      };
    }
    return (
      <div className="search-bar">
        <p className="version-number">v 0.1.3</p>
        <form className="search-input" onSubmit={this.handleSubmit}>
          <input type="text" onChange={this.handleChange} ref={el => this.inputTitle = el} placeholder="Buscar por ID o palabra clave"/>
        </form>
        <div className="profile">
          <p className="name">{this.state.userSession[1]}</p>
          <div className="image" style={styleImg}></div>
        </div>
      </div>
    );
  }
}