import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import VotacaoReducer from './reducer_votacao_new';
import AuthReducer from './reducer_auth';
import DisparaMensagensReducer from '../components/api/disparaMensagens/disparaMensagensReducer';

const rootReducer = combineReducers({
  form: formReducer,
  auth: AuthReducer,
  votacao: VotacaoReducer,
  disparaMensagens: DisparaMensagensReducer,
});

export default rootReducer;
