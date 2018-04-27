class Results extends React.Component {
    constructor(props) {
      super(props);
      this.state = {results: []};
    }
    componentDidMount(){
      const _this = this;
      socket.on('update results', function(msg){
        const results = msg.map((info) =>
          <Song 
            key={info.idkey}
            idkey={info.idkey}
            title={info.title}
            sthumbnail={info.sthumbnail}
            views={numberFormat(info.views)}
            duration={info.duration}
          />
        );
        _this.setState({results});
      });
    }
    render() {
      return (
        <div className="results">{this.state.results}</div>
      );
    }
  }