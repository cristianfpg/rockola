class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value_input: ''};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
          const dataDuration = data.items[0].contentDetails.duration+'';
          const views = data.items[0].statistics.viewCount;
          const match = dataDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
          const hours = (parseInt(match[1]) || 0);
          const minutes = (parseInt(match[2]) || 0);
          const seconds = (parseInt(match[3]) || 0);
          const duration = seconds + (minutes*60) + (hours*3600);
          if(duration >= minDuration && duration <= maxDuration){
            const song = {idkey, title, sthumbnail, views, duration};
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
    return (
      <form className="search-bar" onSubmit={this.handleSubmit}>
        <input type="text" onChange={this.handleChange} ref={el => this.inputTitle = el}/>
      </form>
    );
  }
}