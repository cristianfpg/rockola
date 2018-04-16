class Rockola extends React.Component {
    constructor(props) {
      super(props);
      this.state = {results: ''};
    }
    render() {
      const _this = this;
      setTimeout(function(){
        _this.setState({results: 'ss'});
      }, 1000);
      return (
        <div id="main-container">
          <SearchBar/>
          <Results prueba={this.state.results}/>
          <Playlist/>      
          <PlayerBar/>      
        </div>
      );
    }
  }
  
ReactDOM.render(
    <Rockola />,
    document.getElementById('rockola')
  ); 