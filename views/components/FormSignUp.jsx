import React from 'react'

export default class FormSignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      nombre: event.target.nombre,
      email: event.target.email,
      contrasena: event.target.contrasena
    });
  }

  render() {
    return (
      <div>
        <h2>Sign up</h2>
        <form method="post" action="/nuevousuario">
          <label for="nombre">nombre</label>
          <input type="text" id="nombre" name="nombre" value={this.state.nombre} onChange={this.handleChange}/>
          <label for="email">email</label>
          <input type="email" id="email" name="email" value={this.state.email} onChange={this.handleChange}/>
          <label for="contrasena">contraseña</label>
          <input type="password" id="contrasena" name="contrasena" value={this.state.contrasena} onChange={this.handleChange}/>
          <input type="submit"/>
        </form>
      </div>
    );
  }
}
