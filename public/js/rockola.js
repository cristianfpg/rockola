class Rockola extends React.Component {
  constructor(props) {
    super(props);
    this.state = {resultados: ''};
    this.handleUpdate = this.handleUpdate.bind(this);
  }
  handleUpdate(e){
    this.setState({resultados: e});
  }
  render() {
    return (
      <div> 
        <Buscador listItems={this.handleUpdate}/>
        <Iframe/>
        <Resultados lista={this.state.resultados}/>
      </div>
    );
  }
}

ReactDOM.render(
  <Rockola />,
  document.getElementById('rockola')
);