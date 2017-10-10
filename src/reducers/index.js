import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { ApolloClient, ApolloProvider } from 'react-apollo';
import VotacaoReducer from './reducer_votacao_new';
import AuthReducer from './reducer_auth';
import MensagensReducer from '../components/api/mensagens/mensagensReducer';

export const client = new ApolloClient();

export const reducers = combineReducers({
  form: formReducer,
  auth: AuthReducer,
  votacao: VotacaoReducer,
  mensagens: MensagensReducer,
  apollo: client.reducer(),
});
