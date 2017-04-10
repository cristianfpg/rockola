import React from 'react'
import HtmlLayout from '../layouts/Html'

export default class Index extends React.Component {
  render() {
    return (
      <HtmlLayout prueba={this.props.prueba}/>
    );
  }
}
