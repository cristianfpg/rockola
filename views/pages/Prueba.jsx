import React from 'react'

export default class Index extends React.Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    console.log('thiss is:', this);
    e.preventDefault();
  }
  render() {
    return (

    );
  }
}
