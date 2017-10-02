import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import VotacaoReducer from './reducer_votacao_new';
import AuthReducer from './reducer_auth';
import MensagensReducer from '../components/api/mensagens/mensagensReducer';

const rootReducer = combineReducers({
  form: formReducer,
  auth: AuthReducer,
  votacao: VotacaoReducer,
  mensagens: MensagensReducer,
});

export default rootReducer;
