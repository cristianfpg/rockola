class Iframe extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount(){
    console.log('mount')
  }
  render() {
    return (
      <div>
        <img id="iframeimg"/>
        <div id="iframe"></div>
      </div>
    );
  }
}
