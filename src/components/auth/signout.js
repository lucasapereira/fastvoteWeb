import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withApollo } from 'react-apollo';
import * as actions from '../../actions';

class Signout extends Component {
  componentWillMount() {
    this.props.client.resetStore();
    this.props.signoutUser();
    this.props.history.push('/frontend/auth/signin');
  }

  render() {
    return <div>Sorry to see you go...</div>;
  }
}

const reduxSignout = connect(null, actions)(Signout);

export default withApollo(reduxSignout);
