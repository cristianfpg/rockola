import React from 'react'

export default class FormSearch extends React.Component {
  /*
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      nombre: event.target.nombre
    });
  }
  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.nombre);
    event.preventDefault();
  }
  render() {
    return (
      <form>
        <label htmlFor="busqueda">
          Búsqueda
        </label>
        <input type="text" id="busqueda" value={this.state.nombre} onChange={this.handleChange}/>
        <input type="submit" value="Submit" />
    </form>
    );
  }
  */
  constructor(props) {
    super(props);
  }
  onTestClick() {
    alert('here');
  }
  render() {
    return (
        <button onClick={this.onTestClick}>primary</button>
    );
  }
}
