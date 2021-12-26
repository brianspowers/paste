import React, { Component } from 'react';

import './style.scss';

export default class Home extends Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  state = {
    message: '',
  }

  handleChange(event) {
    this.setState({message: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    fetch('/.netlify/functions/paste', {
	    method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },      
	    body: JSON.stringify({
		    message: this.state.message,
	    }),
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then(jsonResponse => {
      this.props.history.push(`/${jsonResponse.token}`);
    })
    .catch(error => {
      console.log('There has been a problem with your fetch operation: ' + error.message);
    });

  }

  render() {
    return (
      <div className="columns">
        <div className="column is-three-quarters">
          <form className="createPasteForm" onSubmit={this.handleSubmit}>
            <div className="control">
              <label className="label">Message</label>
              <p className="control">
                <textarea className="textarea" value={this.state.message} onChange={this.handleChange} />
              </p>
            </div>
            <div className="control">
              <input type="submit" className="button is-medium is-primary" value="Create Paste" />
            </div>
          </form>
        </div>
      </div>
    );
  }
}
