import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import './style.scss';

import App from './App';
import Home from './Home';
import Paste from './Paste';

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path=":token" component={Paste} />
    </Route>
  </Router>
), document.getElementById('root'));
