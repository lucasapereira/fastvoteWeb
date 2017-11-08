import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';
import Loadable from 'react-loadable';

import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { onError } from 'apollo-link-error';
import { setContext } from 'apollo-link-context';

import { ApolloProvider } from 'react-apollo';

import { AUTH_USER, UNAUTH_USER } from './actions/auth';

import { getStorage } from './components/generic/storage';

import { reducers } from './reducers';

import Header from './components/generic/header';

import Signin from './components/auth/signin';
import Forbidden from './components/auth/forbidden';
import Signout from './components/auth/signout';
import RequireAuth from './components/auth/require_auth';

import MyLoadingComponent from './navigation/MyLoadingComponent';

const VotacaoList = Loadable({
  loader: () => import('./components/api/posts/votacao_list'),
  loading: MyLoadingComponent,
});

const VotacaoNew = Loadable({
  loader: () => import('./components/api/posts/votacao_new'),
  loading: MyLoadingComponent,
});
const Mensagens = Loadable({
  loader: () => import('./components/api/mensagens/mensagens'),
  loading: MyLoadingComponent,
});

const MinhasMensagens = Loadable({
  loader: () => import('./components/api/mensagens/minhasMensagensScreen'),
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

const GestaoUsuario = Loadable({
  loader: () => import('./components/api/gestaoUsuario/listaUsuarioScreen'),
  loading: MyLoadingComponent,
});

const NovoUsuario = Loadable({
  loader: () => import('./components/api/gestaoUsuario/novoUsuarioScreen'),
  loading: MyLoadingComponent,
});

const UpdateUsuario = Loadable({
  loader: () => import('./components/api/gestaoUsuario/updateUsuarioScreen'),
  loading: MyLoadingComponent,
});

const store = createStore(
  reducers,
  {}, // initial state
  compose(
    applyMiddleware(reduxThunk),
    // If you are using the devToolsExtension, you can add it here also
    /* eslint-disable */
    typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined'
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : f => f
    /*eslint-enable*/
  )
);

//const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
//const store = createStoreWithMiddleware(reducers);

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
        token ? (
          <Redirect to="/frontend/usuario/listvotacao" />
        ) : (
          <Redirect to="/frontend/auth/signin" />
        )
      }
    />
    <Route
      exact
      path="/frontend"
      render={() =>
        token ? (
          <Redirect to="/frontend/usuario/listvotacao" />
        ) : (
          <Redirect to="/frontend/auth/signin" />
        )
      }
    />
    <Route path="/frontend/usuario/listvotacao" component={RequireAuth(ListVotacaoScreen)} />
    <Route path="/frontend/votacao/nova" component={RequireAuth(VotacaoNew)} />
    <Route path="/frontend/votacao/mensagens" component={RequireAuth(Mensagens)} />

    <Route path="/frontend/mensagens/minhasMensagens" component={RequireAuth(MinhasMensagens)} />

    <Route path="/frontend/gestaoUsuario/listaUsuario" component={RequireAuth(GestaoUsuario)} />
    <Route path="/frontend/gestaoUsuario/novoUsuario" component={RequireAuth(NovoUsuario)} />
    <Route
      path="/frontend/gestaoUsuario/updateUsuario/:codUsuarioRepresentacao"
      component={RequireAuth(UpdateUsuario)}
    />

    <Route
      path="/frontend/votacao/resultado/:codVotacao"
      component={RequireAuth(VotacaoResultado)}
    />
    <Route path="/frontend/auth/esquecisenha" component={EsqueciSenha} />
    <Route path="/frontend/votacao/list" component={RequireAuth(VotacaoList)} />
    <Route path="/frontend/auth/trocarsenha" component={TrocarSenha} />
    <Route path="/frontend/auth/signin" component={Signin} />
    <Route path="/frontend/auth/signout" component={Signout} />
    <Route path="/frontend/auth/forbidden" component={Forbidden} />
    <Route component={NoMatch} />
  </Switch>
);

const telaPrincipal = token => (
  <BrowserRouter>
    <div>
      <Header />
      <MuiThemeProvider>{rotas(token)}</MuiThemeProvider>
    </div>
  </BrowserRouter>
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

  // const networkInterface = createNetworkInterface({
  //   uri: `${process.env.REACT_APP_BASE_URL_BACKEND}:${process.env
  //     .REACT_APP_BASE_URL_BACKEND_PORT}/graphql`,
  // });

  // networkInterface.use([
  //   {
  //     applyMiddleware(req, next) {
  //       if (!req.options.headers) {
  //         req.options.headers = {}; // Create the header object if needed.
  //       }
  //       req.options.headers['x-access-token'] = getStorage('token');
  //       next();
  //     },
  //   },
  // ]);

  // networkInterface.useAfter([
  //   {
  //     applyAfterware({ response }, next) {
  //       if (response.status === 401) {
  //         store.dispatch({
  //           type: UNAUTH_USER,
  //         });
  //       }

  //       if (response.status === 403) {
  //         console.log('deu erro 403 de forbidden, melhorar aqui pra ir pra tela de forbidden');
  //         store.dispatch({
  //           type: UNAUTH_USER,
  //         });
  //       }
  //       next();
  //     },
  //   },
  // ]);

  // const client = new ApolloClient({
  //   networkInterface,
  // });

  const httpLink = createHttpLink({
    uri: `${process.env.REACT_APP_BASE_URL_BACKEND}:${
      process.env.REACT_APP_BASE_URL_BACKEND_PORT
    }/graphql`,
  });

  const middlewareLink = setContext(() => ({
    headers: {
      authorization: getStorage('token') || null,
      'x-access-token': getStorage('token') || null,
    },
  }));
  // use with apollo-client
  const mlink = middlewareLink.concat(httpLink);

  const errorLink = onError(({ networkError, graphQLErrors }) => {
    if (networkError.statusCode === 401) {
      store.dispatch({
        type: UNAUTH_USER,
      });
    }

    if (networkError.statusCode === 403) {
      console.log('deu erro 403 de forbidden, melhorar aqui pra ir pra tela de forbidden');
      store.dispatch({
        type: UNAUTH_USER,
      });
    }
  });

  const link = errorLink.concat(mlink);

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });

  return (
    <Provider store={store}>
      <ApolloProvider client={client}>{telaPrincipal(token)}</ApolloProvider>
    </Provider>
  );
};
