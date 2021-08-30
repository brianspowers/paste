import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './style.scss';

import App from './App';
import Home from './Home';
import Paste from './Paste';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App>
        <Switch>
          <Route path="/:token" component={Paste} />
          <Route component={Home} />
        </Switch>
      </App>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
