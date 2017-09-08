import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export default function (ComposedComponent) {
  class Authentication extends Component {
    redirect = (props) => {
      if (!props.authenticated) {
        this.context.router.history.push('/frontend/auth/signin');
        return;
      }

      let autorizado = false;

      props.funcionalidades.forEach((url) => {
        const arr = props.history.location.pathname.split('/');
        if (`/${arr[2]}/${arr[3]}` === `${url.trim()}`) {
          autorizado = true;
        }
      });

      if (!autorizado) {
        this.context.router.history.push('/frontend/auth/forbidden');
      }
    };

    static contextTypes = {
      router: PropTypes.object,
    };

    componentWillMount() {
      this.redirect(this.props);
    }

    componentWillUpdate(nextProps) {
      this.redirect(nextProps);
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    return {
      authenticated: state.auth.authenticated,
      urlAutorizadas: state.auth.urlAutorizadas,
      funcionalidades: state.auth.funcionalidades,
    };
  }

  return connect(mapStateToProps)(Authentication);
}
