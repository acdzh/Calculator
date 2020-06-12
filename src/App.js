import React from 'react';
import * as PropTypes from "prop-types";
import './App.css';

import { Switch, Route, Link } from 'react-router-dom';

import NavigationView from "react-uwp/NavigationView";
import SplitViewCommand from "react-uwp/SplitViewCommand";

import Standard from "./Component/Standard";
import Scientific from "./Component/Scientific"
import DateCom from "./Component/Date";
import Setting from "./Component/Setting"
import About from './Component/About'

const navigationTopNodes = [
  { link: 'standard', label: 'Standard', icon: 'CalculatorLegacy' },
  { link: 'scientific', label: 'Scientific', icon: 'Lightbulb' },
  // { link: 'programmer', label: 'Programmer', icon: 'Code' },
  { link: 'date', label: 'Data Calculation', icon: 'Calendar' },
].map(c => <Link style={{textDecoration: 'none'}} to={c.link}><SplitViewCommand label={c.label} icon={c.icon} /></Link>);

const navigationBottomNodes = [
  { link: 'setting', label: 'Setting', icon: "\uE713" },
  { link: 'about', label: 'About', icon: "Info" },
].map(c => <Link style={{textDecoration: 'none'}} to={c.link}><SplitViewCommand label={c.label} icon={c.icon} /></Link>);

export class App extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  render() {
    return (
      <NavigationView
      isControlled={false}
      style={{...this.context.theme.acrylicTexture40.style, height: '100%', width: '100%'}}
      pageTitle=""
      displayMode="overlay"
      autoResize={false}
      initWidth={48}
      navigationTopNodes={navigationTopNodes}
      navigationBottomNodes={navigationBottomNodes}
      focusNavigationNodeIndex={0}
    >
      <div style={{ paddingLeft: '48px', width: '100%', height: '100%'}}>
        <Switch>
          <Route exact path="/" component={Standard} />
          <Route path="/standard" component={Standard} />
          <Route path="/scientific" component={Scientific} />
          <Route path="/date" component={DateCom} />
          <Route path="/setting" component={Setting} />
          <Route path="/about" component={About} />
        </Switch>
      </div>
    </NavigationView>

    )
  }
}

export default App;