import React from 'react'
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router'

export default class HtmlLayout extends React.Component {
  render() {
    return (
      <html>
        <head>
          <title>Prueba</title>
          <link rel="stylesheet" type="text/css" href="/assets/css/color.css"/>  
        </head>
        <body>
          <Router history={hashHistory}>
            <Route path='/' component={Home} />
            <Route path='/address' component={Address} />
          </Router>
        </body>
      </html>
    );
  }
}

const Home = () => <h1>Hello from Home!</h1>
const Address = () => <h1>We are located at 555 Jackson St.</h1>