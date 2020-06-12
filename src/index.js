import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { Theme , getTheme } from "react-uwp/Theme";
import * as serviceWorker from './serviceWorker';

import { Router } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
const customHistory = createBrowserHistory();


let mode = 'light';
if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
  mode = 'dark';
}


ReactDOM.render(
  <React.StrictMode>
    <Theme
      theme = { getTheme({
        themeName: localStorage.getItem('theme-name') || 'light', // set custom theme
        accent: localStorage.getItem('theme-accent') || "#0078D7", // set accent color
        useFluentDesign: localStorage.getItem('use-fluent') === 'true' ? true : false, // sure you want use new fluent design.
        desktopBackgroundImage: localStorage.getItem('theme-bg') || "/bg.jpg" // set global desktop background image
      })}
    >
      <Router history={customHistory}>
        <App />
      </Router>
    </Theme>
    
  </React.StrictMode>
  ,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
