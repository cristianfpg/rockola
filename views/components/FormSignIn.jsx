import React from 'react'

export default class FormSignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: 'desarrollo1@coloralcuadrado.com',
      contrasena : ''
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      email: event.target.email,
      contrasena: event.target.contrasena
    });
  }

  render() {
    return (
      <div>
        <h2>Signin</h2>
        <form method="post" action="/verificarusuario">
          <label for="email"></label>
          <input type="email" id="email" name="email" value={this.state.email} onChange={this.handleChange}/>
          <label for="contrasena"></label>
          <input type="text" id="contrasena" name="contrasena" value={this.state.contrasena} onChange={this.handleChange}/>
          <input type="submit"/>
        </form>
      </div>
    );
  }
}
