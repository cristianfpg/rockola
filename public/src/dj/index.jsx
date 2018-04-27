class Dj extends React.Component {
  constructor(props) {
    super(props);
    this.state = {fetchget: null, actualvalue: '', newvalue: '', statevalue: ''};
    this.handleEditUsers = this.handleEditUsers.bind(this);
    this.handleChangeActual = this.handleChangeActual.bind(this);
    this.handleChangeNew = this.handleChangeNew.bind(this);
    this.handleChangeState = this.handleChangeState.bind(this);
  }
  handleFetchGet(e){
    const _this = this;
    fetchGet(e,function(data){
      var getSessions = data.data.map((response)=>{
        switch(e){
          case '/getsessions':
            return <li>{response.name}</li>;
          case '/getusers':
            return <li>nombre: {response.name}<br/>admin: {response.admin+''}<br/>player: {response.player+''}<br/>block: {response.block+''}</li>;
        }
      });
      _this.setState({fetchget: getSessions});
    });
  }

  handleChangeActual(e) {
    this.setState({actualvalue: e.target.value});
  }

  handleChangeNew(e) {
    this.setState({newvalue: e.target.value});
  }

  handleChangeState(e) {
    this.setState({statevalue: e.target.value});
  }

  handleEditUsers(e){
    e.preventDefault();
    const _this = this;
    fetchPost('/editusers',{
      actualname: _this.state.actualvalue,
      newname: _this.state.newvalue,
      state: _this.state.statevalue      
    },
    function(json){
      alert(json);
    });
  }
  render() {
    return (
      <div id="main-container">
        <div>
          <p>Informacion general</p>
          <button onClick={() => this.handleFetchGet('/getsessions')}><p>Sesiones activas</p></button>
          <button onClick={() => this.handleFetchGet('/getusers')}><p>Todos los usuarios</p></button>
          <ul>{this.state.fetchget}</ul>
        </div>
        <div>
          <p>Edicion de usuario</p>
          <form onSubmit={this.handleEditUsers}>
            <label>Nombre actual</label>
            <input type="text" onChange={this.handleChangeActual} defaultValue={this.state.actualvalue}/>
            <label>Nombre nuevo</label>
            <input type="text" onChange={this.handleChangeNew} defaultValue={this.state.newvalue}/>
            {/* <div>
              <p>Cambio estado</p>
              <input type="text" onChange={this.handleChangeActual} defaultValue={this.state.actualvalue}/>
            </div> */}
            <label>Cambio estado</label>
            <input type="text" onChange={this.handleChangeState} defaultValue={this.state.statevalue} placeholder="perfil:estado"/>
            <input type="submit"/>
          </form>
        </div>
      </div>
    );
  }
}
  
ReactDOM.render(
  <Dj/>,
  document.getElementById('dj')
); 