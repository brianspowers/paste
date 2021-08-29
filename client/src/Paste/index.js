import React, { Component } from 'react';

import './style.scss';

export default class Paste extends Component {
  constructor(props) {
    super(props);
    this.handleShredClick = this.handleShredClick.bind(this);
  }

  state = {
    loading: false,
    notFound: false,
    message: null,
  };

  componentDidMount() {
    if (this.props.params.token) {
      this.setState({ loading: true });
      fetch(`/api/paste/${this.props.params.token}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          if (response.status === 404) {
            throw new Error('Paste Not Found');
          }
          throw new Error('Network response was not ok.');
        })
        .then((jsonResponse) => {
          this.setState({
            loading: false,
            message: jsonResponse.message,
          });
        })
        .catch((error) => {
          this.setState({
            loading: false,
            notFound: true,
          });
          console.log(
            'There has been a problem with your fetch operation: ' +
              error.message
          );
        });
    }
  }

  handleShredClick() {
    fetch(`/api/paste/${this.props.params.token}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          return;
        }
        throw new Error('Network response was not ok.');
      })
      .then(() => {
        this.props.router.push('/');
      })
      .catch((error) => {
        console.log(
          'There has been a problem with your fetch operation: ' + error.message
        );
        alert('errrrrr');
      });
  }

  renderLoading() {
    return (
      <div className="has-text-centered">
        <span className="icon is-large">
          <i className="fa fa-cog fa-spin fa-3x"></i>
        </span>
        <div>Loading</div>
      </div>
    );
  }

  renderNotFound() {
    return <div className="has-text-centered">Paste Not Found</div>;
  }

  render() {
    if (this.state.loading) {
      return this.renderLoading();
    }
    if (this.state.notFound) {
      return this.renderNotFound();
    }

    return (
      <div className="paste columns">
        <div className="column is-three-quarters ">
          <div
            className="box"
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => (e.target.textContent = this.state.message)}
          >
            {this.state.message}
          </div>
          <button
            className="button is-medium is-danger"
            onClick={this.handleShredClick}
          >
            Shred This Paste
          </button>
        </div>
      </div>
    );
  }
}
