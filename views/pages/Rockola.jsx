import React from 'react'
import HtmlLayout from '../layouts/Html'
import RockolaContainer from '../components/RockolaContainer'
import FormSearch from '../components/FormSearch'
import ScriptSocket from '../components/scripts/ScriptSocket'
import ScriptSocketInit from '../components/scripts/ScriptSocketInit'
import ScriptIframeAPI from '../components/scripts/ScriptIframeAPI'
import ScriptMain from '../components/scripts/ScriptMain'

export default class Rockola extends React.Component {
  render() {
    var rContainer = <RockolaContainer key="RockolaContainer"/>
    var fSearch = <FormSearch key="FormSearch"/>
    var sSocket = <ScriptSocket key="ScriptSocket"/>
    var sSocketI = <ScriptSocketInit key="ScriptSocketInit"/>
    var sIframeAPI = <ScriptIframeAPI key="ScriptIframeAPI"/>
    var sMain = <ScriptMain key="ScriptMain"/>
    var elements = [rContainer, fSearch, sSocket, /*sSocketI*/, sIframeAPI, sMain];
    return (
      <HtmlLayout contenido={elements}/>
    );
  }
}
