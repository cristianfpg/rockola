import React from 'react'

export default class Btn extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <a href={this.props.link}>
        {this.props.texto}
      </a>
    );
  }
}