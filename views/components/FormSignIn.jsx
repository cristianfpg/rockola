import React from 'react'

export default class SignLogin extends React.Component {
  render() {
    return (
      <form method="post" action="/verificarusuario">
        <label for="email"></label> 
        <input value="asd@asd.com" type="email" id="email" name="email"/>
        <label for="contrasena"></label> 
        <input type="text" id="contrasena" name="contrasena"/>
        <input type="submit"/>
      </form>
    );
  }
}