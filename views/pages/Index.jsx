import React from 'react'
import HtmlLayout from '../layouts/Html'
import Btn from '../components/Btn'

export default class Index extends React.Component {
  render() {
    var btn = <Btn key="btnLogOut" link="destroy" texto="cerrar sesion"/>
    return (
      <HtmlLayout contenido={[this.props.nombre,btn]}/>
    );
  }
}
