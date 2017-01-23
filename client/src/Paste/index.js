import React, { Component } from 'react';
import { IndexLink } from 'react-router';

export default class Paste extends Component {
  render() {
    return (
      <div>
        Such pasting. {this.props.params.token}
        <br/>
        <IndexLink to="/">Home</IndexLink>
      </div>
    );
  }
}
