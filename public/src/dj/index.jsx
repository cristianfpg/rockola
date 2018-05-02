class Dj extends React.Component {
  constructor(props) {
    super(props);
    this.state = {fetchget: null, useremail: '', statevalue: ''};
    this.handleEditUsers = this.handleEditUsers.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangeState = this.handleChangeState.bind(this);
  }
  handleFetchGet(e){
    const _this = this;
    fetchGet(e,function(data){
      var getData = data.data.map((response)=>{
        switch(e){
          case '/getsessions':
            return <li>{response.name}</li>;
          case '/getusers':
            return <li>email: {response.email}<br/>nombre: {response.name}<br/>admin: {response.admin+''}<br/>player: {response.player+''}<br/>block: {response.block+''}</li>;
        }
      });
      _this.setState({fetchget: getData});
    });
  }

  handleChangeEmail(e) {
    this.setState({useremail: e.target.value});
  }

  handleChangeState(e) {
    this.setState({statevalue: e.target.value});
  }

  handleSkipSong(){
    fetchPost('/skipsong',{
      admin: true
    },
    function(json){
      console.log(json);
    });
  }

  handleEditUsers(e){
    e.preventDefault();
    const _this = this;
    fetchPost('/editusers',{
      email: _this.state.useremail,
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
          <button onClick={() => this.handleSkipSong()}><p>Cambiar cancion</p></button>
        </div>
        <div>
          <p>Informacion general</p>
          <button onClick={() => this.handleFetchGet('/getsessions')}><p>Sesiones activas</p></button>
          <button onClick={() => this.handleFetchGet('/getusers')}><p>Todos los usuarios</p></button>
          <ul>{this.state.fetchget}</ul>
        </div>
        <div>
          <p>Edicion de usuario</p>
          <form onSubmit={this.handleEditUsers}>
            <label>Email</label>
            <input type="text" onChange={this.handleChangeEmail} defaultValue={this.state.useremail}/>
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