import React from 'react'
import HtmlLayout from '../layouts/Html'
import FormSignUp from '../components/FormSignUp'

export default class Index extends React.Component {
  render() {
    var element = <FormSignUp/>
    return (
      <HtmlLayout contenido={element}/>
    );
  }
}
