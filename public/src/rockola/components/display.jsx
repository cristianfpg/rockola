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
        if(results.length <= 0){
          _this.setState({results: <p className="sin-resultados">No se encontraron resultado válidos</p>});
        }else{
          _this.setState({results});
        }
      });
    }
    render() {
      const resultsLength = this.state.results.length > 0;
      return (
        <div className="display">
          <div className="results">
            {resultsLength &&
              <div className="row results-header">
                <p className="title">Resultados</p>
                <div className="subtitle">
                  <p className="column thumbnail">T</p>
                  <p className="column title-name">Titulo</p>
                  <p className="column channel">Canal</p>
                  <p className="column views">Reproducciones</p>
                  <p className="column duration">Dur.</p>
                </div>
              </div>
            }
            <div className="songs">
              {this.state.results}
            </div>
          </div>
        </div>
      );
    }
  }