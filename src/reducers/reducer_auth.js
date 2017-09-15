import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  FETCH_MESSAGE,
  EMPRESAS_OK,
  CPF_ERROR,
  LIMPA_TELA,
  AUTHENTICATION_PROCESS,
  SENHA_TROCADA,
  SET_SENHA_TROCADA,
  EMAIL_OK,
} from '../actions/auth';

const initialState = {
  error: '',
  empresas: [],
  cpf_error: false,
  authenticated: false,
  limpa_tela: false,
  urlAutorizadas: [],
  loading: false,
  senhaTrocadaComSucesso: false,
  funcionalidades: [],
  email: '',
};
export default function (state = initialState, action) {
  switch (action.type) {
    case SET_SENHA_TROCADA:
      return {
        ...state,
        senhaTrocadaComSucesso: false,
      };
    case SENHA_TROCADA:
      return {
        ...state,
        loading: false,
        error: '',
        cpf_error: false,
        senhaTrocadaComSucesso: true,
      };
    case AUTHENTICATION_PROCESS:
      return {
        ...state,
        loading: true,
      };
    case LIMPA_TELA:
      return {
        ...initialState,
        limpa_tela: action.payload,
      };

    case UNAUTH_USER:
      return {
        ...initialState,
      };

    case AUTH_USER:
      const funcsAutorizadas = action.payload.funcionalidades.map(func => func.dsc_url);
      const urlsAutorizadas = action.payload.menus.map(menu => menu.dsc_url);
      return {
        ...initialState,
        urlAutorizadas: urlsAutorizadas,
        funcionalidades: funcsAutorizadas,
        authenticated: true,
      };
    case AUTH_ERROR:
      return {
        ...state,
        loading: false,

        error: action.payload,
      };
    case CPF_ERROR:
      return {
        ...initialState,
        cpf_error: true,
        empresas: [],
        error: action.payload,
      };
    case FETCH_MESSAGE:
      return {
        ...initialState,
        message: action.payload,
      };
    case EMPRESAS_OK:
      return {
        ...state,
        cpf_error: false,
        empresas: action.payload,
      };
    case EMAIL_OK:
      return {
        ...state,
        cpf_error: false,
        error: '',
        email: action.payload,
      };
    default:
      return {
        ...state,
      };
  }
}
