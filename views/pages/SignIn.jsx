import React from 'react'
import HtmlLayout from '../layouts/Html'
import FormSignIn from '../components/FormSignIn'
import Btn from '../components/Btn'

export default class Index extends React.Component {
  render() {
    var element = <FormSignIn key="1"/>
    var btn = <Btn key="btnSignUp" link="signup" texto="cuenta nueva"/>
    var elements = [element, btn];
    return (
      <HtmlLayout contenido={elements}/>
    );
  }
}
