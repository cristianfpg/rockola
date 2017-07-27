import React from 'react'
// import io from 'socket.io-client'
// let socket = io(`http://localhost:3000`)

export default class HtmlLayout extends React.Component {
  render() {
    return (
      <html>
        <head>
          <title>Rockola al Cuadrado</title>
          <link rel="stylesheet" type="text/css" href="css/color.css"/>
        </head>
        <body>
          {this.props.contenido}
        </body>
      </html>
    );
  }
}
