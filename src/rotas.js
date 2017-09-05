import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

import { AUTH_USER } from './actions/auth';

import { ApolloProvider, ApolloClient, createNetworkInterface } from 'react-apollo';

import { getStorage } from './components/generic/storage';

import reducers from './reducers';

import Header from './components/generic/header';

import Signin from './components/auth/signin';
import Forbidden from './components/auth/forbidden';
import Signout from './components/auth/signout';
import RequireAuth from './components/auth/require_auth';
import Loadable from 'react-loadable';
import MyLoadingComponent from './navigation/MyLoadingComponent';

const VotacaoList = Loadable({
  loader: () => import('./components/api/posts/votacao_list'),
  loading: MyLoadingComponent,
});

const VotacaoNew = Loadable({
  loader: () => import('./components/api/posts/votacao_new'),
  loading: MyLoadingComponent,
});
const VotacaoResultado = Loadable({
  loader: () => import('./components/api/posts/votacao_resultado'),
  loading: MyLoadingComponent,
});
const ListVotacaoScreen = Loadable({
  loader: () => import('./components/api/usuario/listVotacaoScreen'),
  loading: MyLoadingComponent,
});
const TrocarSenha = Loadable({
  loader: () => import('./components/auth/trocarsenha'),
  loading: MyLoadingComponent,
});
const EsqueciSenha = Loadable({
  loader: () => import('./components/auth/esquecisenha'),
  loading: MyLoadingComponent,
});

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);

const NoMatch = ({ location }) => (
  <div>
    <h3>
      Página não encontrada: <code>{location.pathname}</code>
    </h3>
  </div>
);

const rotas = token => (
  <Switch>
    <Route
      exact
      path="/"
      render={() =>
        (token ? <Redirect to="/usuario/listvotacao" /> : <Redirect to="/auth/signin" />)}
    />
    <Route path="/usuario/listvotacao" component={RequireAuth(ListVotacaoScreen)} />
    <Route path="/votacao/nova" component={RequireAuth(VotacaoNew)} />
    <Route path="/votacao/resultado/:codVotacao" component={RequireAuth(VotacaoResultado)} />
    <Route path="/auth/esquecisenha" component={EsqueciSenha} />
    <Route path="/votacao/list" component={RequireAuth(VotacaoList)} />
    <Route path="/auth/trocarsenha" component={TrocarSenha} />
    <Route path="/auth/signin" component={Signin} />
    <Route path="/auth/signout" component={Signout} />
    <Route path="/auth/forbidden" component={Forbidden} />
    <Route component={NoMatch} />
  </Switch>
);

const telaPrincipal = token => (
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <small>
          Ambiente: <b>{process.env.NODE_ENV}</b> <b>{process.env.REACT_APP_BASE_URL}</b>{' '}
          <b>{process.env.REACT_APP_BASE_URL}</b>
        </small>
        <Header />
        <MuiThemeProvider>{rotas(token)}</MuiThemeProvider>
      </div>
    </BrowserRouter>
  </Provider>
);

export const routeTo = () => {
  const token = getStorage('token');
  const menus = JSON.parse(getStorage('menus'));
  const funcionalidades = JSON.parse(getStorage('funcionalidades'));

  // If we have a token, consider the user to be signed in
  if (token && menus) {
    // we need to update application state
    store.dispatch({
      type: AUTH_USER,
      payload: { funcionalidades, menus },
    });
  }

  const networkInterface = createNetworkInterface({
    uri: `${process.env.REACT_APP_BASE_URL}/graphql`,
  });

  networkInterface.use([
    {
      applyMiddleware(req, next) {
        if (!req.options.headers) {
          req.options.headers = {}; // Create the header object if needed.
        }
        req.options.headers['x-access-token'] = getStorage('token');
        next();
      },
    },
  ]);

  const client = new ApolloClient({
    networkInterface,
  });

  return <ApolloProvider client={client}>{telaPrincipal(token)}</ApolloProvider>;
};
