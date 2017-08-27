import { FETCH_EMPRESAS, ERROR_VOTACAO, SET_COD_PESSOA_JURIDICA } from '../actions';

const initialState = {
  dataSource: [],
  cod_pessoa_juridica: '',
  loading: false,
  errorMessage: '',
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_EMPRESAS:
      return {
        ...state,
        loading: false,
        dataSource: action.payload,
      };
    case ERROR_VOTACAO:
      return {
        ...initialState,
        errorMessage: action.payload,
      };

    case SET_COD_PESSOA_JURIDICA:
      return {
        ...initialState,
        cod_pessoa_juridica: action.payload,
      };
    default:
      return state;
  }
}
