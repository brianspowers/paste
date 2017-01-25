import React, { Component } from 'react';
import { IndexLink } from 'react-router';

import './style.scss';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <nav className="nav hero is-default has-shadow" id="top">
          <div className="container">
            <div className="nav-left">
              <IndexLink className="nav-item" to="/">
                <span className="siteHeader"><strong>PowersPaste</strong></span>
              </IndexLink>
            </div>
          </div>
        </nav>

        <section className="section mainContent">    
          <div className="container">
            {this.props.children}
          </div>
        </section>

        <footer className="footer">
          <div className="container">
            <div className="content has-text-centered">
              <p>
                <strong>PowersPaste</strong> by Brian Powers. 
              </p>
              <p>
                <a className="icon" href="https://github.com/brianspowers">
                  <i className="fa fa-github" />
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}
