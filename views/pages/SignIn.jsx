import React from 'react'
import HtmlLayout from '../layouts/Html'
import FormSignIn from '../components/FormSignIn'

export default class Index extends React.Component {
  render() {
    var element = <FormSignIn/>
    return (
      <HtmlLayout prueba={this.props.prueba} contenido={element}/>
    );
  }
}
