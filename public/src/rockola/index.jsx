class Rockola extends React.Component {
  constructor(props) {
    super(props);
    this.state = {results: ''};
  }
  render() {
    return (
      <div id="main-container">
        <SearchBar/>
        <Results/>
        <Playlist/>      
        <PlayerBar/>
        <div id="iframe-yt"></div> 
      </div>
    );
  }
}
  
ReactDOM.render(
  <Rockola />,
  document.getElementById('rockola')
); 