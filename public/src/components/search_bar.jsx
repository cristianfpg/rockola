class SearchBar extends React.Component {
    constructor(props) {
      super(props);
      this.state = {value_input: ''};
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event) {
      this.setState({value_input: event.target.value});
    }
    handleSubmit(event){
      const _this = this;
      const qSearch = epSearch+_this.state.value_input+pSearch;
      // fetchQuery(qSearch,function(data){
      //   console.log(data);
      //   _this.inputTitle.value = '';        
      // });
      // _this.inputTitle.value = 'Buscando...';
      event.preventDefault();
    }
    render() {
      return (
        <form className="search-bar" onSubmit={this.handleSubmit}>
          <input type="text" onChange={this.handleChange} ref={el => this.inputTitle = el}/>
        </form>
      );
    }
  }