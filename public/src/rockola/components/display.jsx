class Display extends React.Component {
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
            channel={info.channel}
            minutes={info.minutes}
            seconds={info.seconds}
          />
        );
        _this.setState({results});
      });
    }
    render() {
      const resultsLength = this.state.results.length > 0 || true;
      return (
        <div className="display">
          <div className="results-header">
            {resultsLength &&
              <div>
                <p className="titulo">Resultados</p>
                <div className="row">
                  <p className="column thumbnail"></p>
                  <p className="column title">Titulo</p>
                  <p className="column channel">Canal</p>
                  <p className="column views">Reproducciones</p>
                </div>
              </div>
            }
          </div>
          {this.state.results}
        </div>
      );
    }
  }