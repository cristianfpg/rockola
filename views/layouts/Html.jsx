import React from 'react'

export default class HtmlLayout extends React.Component {
  render() {
    return (
      <html>
        <head>
          <title>Rockola al Cuadrado</title>
          <link rel="stylesheet" type="text/css" href="/assets/css/color.css"/>  
        </head>
        <body>
          {this.props.contenido}
        </body>
      </html>
    );
  }
}
