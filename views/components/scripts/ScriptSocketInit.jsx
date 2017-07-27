import React from 'react'

export default class ScriptSocketInit extends React.Component {
  render() {
    return (
      <script>
        var socket = io();
      </script>
    );
  }
}
